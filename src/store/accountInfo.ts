import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import { format } from "date-fns";
import type { ApiAccountInfo } from "zksync/build/types";
import type { SelectOption } from "@/components/common/Select.vue";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";
import type { FormField } from "@/components/common/Field.vue";
import { accountInfoKeys, fieldsNames, type AccountInfoNameKeys } from "@/utils/fields";
import { getAccountInfoTableData } from "@/utils/tableData";
import { downloadData } from "@/utils/download";
import { requestAccountState } from "@/utils/requests";
import { isAddress } from "@/utils/validators";

export type Values = {
  address: null | string;
  stateToExport: SelectOption;
  fields: AccountInfoNameKeys[];
};

export const stateToExportOptions: SelectOption[] = [
  { id: 1, key: "committed", name: "Committed state" },
  { id: 2, key: "finalized", name: "Verified state" },
];

const defaultFields = <Set<AccountInfoNameKeys>>(
  new Set(["accountID", "accountAddress", "accountType", "accountNonce", "accountLastUpdateInBlock", "pubKey"])
);
const fieldsOptions: MultiSelectOption[] = accountInfoKeys.map((key, index) => ({
  id: index,
  value: key,
  label: fieldsNames[key],
  default: defaultFields.has(key as AccountInfoNameKeys),
}));

export default defineStore("accountInfo", () => {
  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const isRequestSuccessful = ref(false);

  const defaultValues: Values = {
    address: null,
    stateToExport: stateToExportOptions[0],
    fields: fieldsOptions.filter((e) => e.default === true).map((e) => e.value as AccountInfoNameKeys),
  };
  const values = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const searchValues = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const account: Ref<ApiAccountInfo | null> = ref(null);

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
        { component: "select", prop: "stateToExport", name: "State to export", options: stateToExportOptions },
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
      account.value = null;
      if (!isAddress(searchValues.value.address)) {
        throw new Error("Valid address wasn't provided");
      }
      searchValues.value.address = searchValues.value.address.trim();
      if (searchValues.value.fields.length === 0) {
        throw new Error("There should be at least one column to save");
      }
      const accountState = await requestAccountState(searchValues.value.address!);
      account.value = accountState[searchValues.value.stateToExport.key as "committed" | "finalized"];
      isRequestSuccessful.value = true;
    } catch (error: unknown) {
      console.warn("Account account search error", error);
      requestFail.value = (error as any)?.toString() || true;
    } finally {
      isRequestPending.value = false;
    }
  }

  function download() {
    downloadData(
      getAccountInfoTableData(account.value!, {
        fields: values.value.fields,
      }),
      `Account_${searchValues.value.address}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`
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
    account,
    areValuesDefault,
    resetValues,
    resetSearchValues,
    searchWithSelectedSettings,
    search,
    download,
  };
});
