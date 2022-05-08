import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { format } from "date-fns";
import type { ApiAccountInfo } from "zksync/build/types";
import type { SelectOption } from "@/components/common/Select.vue";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";
import type { FormField } from "@/components/common/Field.vue";
import { balancesFieldKeys, fieldsNames, type BalancesFieldNameKeys } from "@/utils/fields";
import { logError } from "@/utils/logger";
import { getBalancesTableData } from "@/utils/tableData";
import { downloadData } from "@/utils/download";
import { requestAccountState } from "@/utils/requests";
import { isAddress } from "@/utils/validators";
import useTokens from "./tokens";

export type Values = {
  address: null | string;
  includeEmptyBalances: boolean;
  balancesToExport: SelectOption;
  fields: BalancesFieldNameKeys[];
};

export const balancesToExportOptions: SelectOption[] = [
  { id: 1, key: "committed", name: "Committed balances" },
  { id: 2, key: "finalized", name: "Verified balances" },
];

const defaultFields = <Set<BalancesFieldNameKeys>>new Set(["tokenSymbol", "amount"]);
const fieldsOptions: MultiSelectOption[] = balancesFieldKeys.map((key, index) => ({
  id: index,
  value: key,
  label: fieldsNames[key],
  default: defaultFields.has(key as BalancesFieldNameKeys),
}));

export default defineStore("accountBalances", () => {
  const tokens = useTokens();

  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const isRequestSuccessful = ref(false);

  const defaultValues: Values = {
    address: null,
    includeEmptyBalances: false,
    balancesToExport: balancesToExportOptions[0],
    fields: fieldsOptions.filter((e) => e.default === true).map((e) => e.value as BalancesFieldNameKeys),
  };
  const values = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const searchValues = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const balances = ref(<ApiAccountInfo["balances"]>{});

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
        { component: "toggle", prop: "includeEmptyBalances", name: "Include empty balances" },
        { component: "select", prop: "balancesToExport", name: "Balances to export", options: balancesToExportOptions },
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
      balances.value = {};
      if (!isAddress(searchValues.value.address)) {
        throw new Error("Valid address wasn't provided");
      }
      searchValues.value.address = searchValues.value.address!.trim();
      if (searchValues.value.fields.length === 0) {
        throw new Error("There should be at least one column to save");
      }
      await tokens.requestTokens();
      if (tokens.requestFail) {
        throw new Error(
          typeof tokens.requestFail === "string" ? tokens.requestFail : "We were not able to request tokens information"
        );
      }
      const accountState = await requestAccountState(searchValues.value.address!);
      balances.value =
        accountState[searchValues.value.balancesToExport.key as "committed" | "finalized"]?.balances ?? {};
      isRequestSuccessful.value = true;
    } catch (error: unknown) {
      logError("Account balances search error: " + error);
      requestFail.value = (error as any)?.toString() || true;
    } finally {
      isRequestPending.value = false;
    }
  }

  function download() {
    downloadData(
      getBalancesTableData(balances.value, {
        includeEmptyBalances: searchValues.value.includeEmptyBalances,
        fields: values.value.fields,
      }),
      `Balances_${searchValues.value.address}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`
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
    balances,
    areValuesDefault,
    resetValues,
    resetSearchValues,
    searchWithSelectedSettings,
    search,
    download,
  };
});
