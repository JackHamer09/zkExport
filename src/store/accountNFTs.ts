import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { format } from "date-fns";
import type { ApiAccountInfo } from "zksync/build/types";
import type { SelectOption } from "@/components/common/Select.vue";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";
import type { FormField } from "@/components/common/Field.vue";
import { logError } from "@/utils/logger";
import { nftsFieldKeys, fieldsNames, type NFTsFieldNameKeys } from "@/utils/fields";
import { getNFTsTableData } from "@/utils/tableData";
import { downloadData } from "@/utils/download";
import { requestAccountState } from "@/utils/requests";
import { isAddress } from "@/utils/validators";
import getError from "@/utils/errors";

export type Values = {
  address: null | string;
  nftsToExport: SelectOption;
  fields: NFTsFieldNameKeys[];
};

export const nftsToExportOptions: SelectOption[] = [
  { id: 1, key: "nfts", name: "Owned NFTs" },
  { id: 2, key: "mintedNfts", name: "Minted NFTs" },
];

const defaultFields = <Set<NFTsFieldNameKeys>>new Set(["tokenSymbol", "contentHash", "creatorAddress"]);
const fieldsOptions: MultiSelectOption[] = nftsFieldKeys.map((key, index) => ({
  id: index,
  value: key,
  label: fieldsNames[key],
  default: defaultFields.has(key as NFTsFieldNameKeys),
}));

export default defineStore("accountNFTs", () => {
  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const isRequestSuccessful = ref(false);

  const defaultValues: Values = {
    address: null,
    nftsToExport: nftsToExportOptions[0],
    fields: fieldsOptions.filter((e) => e.default === true).map((e) => e.value as NFTsFieldNameKeys),
  };
  const values = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const searchValues = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const nfts = ref(<ApiAccountInfo["nfts"]>{});

  const requiredFields = computed(
    () =>
      <FormField<keyof Values>[]>[
        {
          component: "input",
          validation: "address",
          prop: "address",
          name: "Account address",
          placeholder: "0x...",
        },
      ]
  );
  const fields = computed(
    () =>
      <FormField<keyof Values>[]>[
        { component: "select", prop: "nftsToExport", name: "NFTs to export", options: nftsToExportOptions },
        { component: "multiselect", prop: "fields", name: "Columns", options: fieldsOptions },
      ]
  );
  const areValuesDefault = computed(() => {
    return JSON.stringify({ ...values.value, address: "" }) === JSON.stringify({ ...defaultValues, address: "" });
  });

  function resetValues() {
    values.value = JSON.parse(JSON.stringify(defaultValues));
  }

  function resetSearchValues() {
    searchValues.value = JSON.parse(JSON.stringify(defaultValues));
  }

  async function searchWithSelectedSettings() {
    searchValues.value = Object.assign({}, values.value);
    search();
  }

  async function search() {
    try {
      isRequestPending.value = true;
      isRequestSuccessful.value = false;
      requestFail.value = false;
      nfts.value = {};
      if (!isAddress(searchValues.value.address)) {
        throw new Error(getError("INVALID_ADDRESS_INPUTTED"));
      }
      searchValues.value.address = searchValues.value.address!.trim();
      if (searchValues.value.fields.length === 0) {
        throw new Error(getError("ZERO_FIELDS_INPUTTED"));
      }
      const accountState = await requestAccountState(searchValues.value.address!);
      nfts.value = accountState.committed[searchValues.value.nftsToExport.key as "nfts" | "mintedNfts"] ?? {};
      isRequestSuccessful.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logError("Account nfts search error: " + error);
      requestFail.value = (error && error.message ? error.message : error) || true;
    } finally {
      isRequestPending.value = false;
    }
  }

  function download() {
    downloadData(
      getNFTsTableData(nfts.value, {
        fields: values.value.fields,
      }),
      `NFTs_${searchValues.value.address}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`
    );
  }

  return {
    isRequestPending,
    requestFail,
    isRequestSuccessful,
    values,
    searchValues,
    requiredFields,
    fields,
    nfts,
    areValuesDefault,
    resetValues,
    resetSearchValues,
    searchWithSelectedSettings,
    search,
    download,
  };
});
