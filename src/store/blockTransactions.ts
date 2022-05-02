import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { $fetch } from "ohmyfetch";
import { format } from "date-fns";
import type { ApiTransaction } from "zksync/build/types";
import type { Request } from "@/types";
import type { SelectOption } from "@/components/common/Select.vue";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";
import type { FormField } from "@/components/common/Field.vue";
import { fieldsNames, transactionFieldKeys, type TransactionFieldNameKeys } from "@/utils/fields";
import { getTransactionsTableData } from "@/utils/tableData";
import { wait } from "@/utils/helpers";
import { isTransactionHash } from "@/utils/validators";
import { downloadData } from "@/utils/download";
import useNetwork from "./network";
import useTokens from "./tokens";
import useConfig from "./config";

export type Values = {
  blockID: null | string;
  startFrom: SelectOption;
  startHash: null | string;
  startDatetime: null | Date;
  direction: SelectOption;
  finishAt: SelectOption;
  finishHash: null | string;
  finishDatetime: null | Date;
  max: null | string;
  dateSort: SelectOption;
  skipFailed: boolean;
  removeEmptyColumns: boolean;
  fields: TransactionFieldNameKeys[];
};

export const startFromOptions: SelectOption[] = [
  { id: 1, key: "latest", name: "Latest transaction" },
  { id: 2, key: "transaction", name: "Specific transaction" },
  { id: 3, key: "datetime", name: "Specific time" },
];
const finishAtOptionOlder = { id: 1, key: "oldest", name: "Oldest transactions" };
const finishAtOptionNewest = { id: 2, key: "oldest", name: "Newest transactions" };
export const finishAtOptionsDefault: SelectOption[] = [
  { id: 3, key: "transaction", name: "Specific transaction" },
  { id: 4, key: "limit", name: "Max transactions amount" },
  { id: 5, key: "datetime", name: "Specific time" },
];

const directionOptionsDefault: SelectOption[] = [{ id: 1, key: "older", name: "Older transactions" }];
const dateSortOptions: SelectOption[] = [
  { id: 1, key: "descending", name: "From newer to older" },
  { id: 2, key: "ascending", name: "From older to newer" },
];
const defaultFields = <Set<TransactionFieldNameKeys>>(
  new Set([
    "createdAt",
    "txHash",
    "status",
    "type",
    "failReason",
    "blockNumber",
    "from",
    "to",
    "tokenSymbol",
    "amount",
    "feeTokenSymbol",
    "feeAmount",
    "contentHash",
    "swapOrderAccountAddress",
    "swapOrderTokenSymbol",
    "swapOrderAmount",
    "swapOrderAmountsPretty",
  ])
);
const fieldsOptions: MultiSelectOption[] = transactionFieldKeys.map((key, index) => ({
  id: index,
  value: key,
  label: fieldsNames[key],
  default: defaultFields.has(key as TransactionFieldNameKeys),
}));

export default defineStore("blockTransactions", () => {
  const network = useNetwork();
  const tokens = useTokens();
  const config = useConfig();

  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const isRequestSuccessful = ref(false);
  const askToStop = ref(false);

  const defaultValues: Values = {
    blockID: null,
    startFrom: startFromOptions[0],
    startHash: null,
    startDatetime: null,
    direction: directionOptionsDefault[0],
    finishAt: finishAtOptionOlder,
    finishHash: null,
    finishDatetime: null,
    max: "1000",
    dateSort: dateSortOptions[0],
    skipFailed: true,
    removeEmptyColumns: true,
    fields: fieldsOptions.filter((e) => e.default === true).map((e) => e.value as TransactionFieldNameKeys),
  };
  const values = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const searchValues = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const txList = ref(<ApiTransaction[]>[]);

  const requiredFields = computed(
    () =>
      <FormField<keyof Values>[]>[
        {
          component: "input",
          validation: "blockID",
          prop: "blockID",
          name: "Block ID",
          placeholder: "Enter block ID",
        },
      ]
  );
  const fields = computed(() => {
    const finalFields: FormField<keyof Values>[] = [
      { component: "select", prop: "startFrom", name: "Start from", options: startFromOptions },
    ];
    if (values.value.startFrom?.key === "transaction") {
      finalFields.push({
        component: "input",
        validation: "hash",
        prop: "startHash",
        name: "Start from transaction",
        placeholder: "Transaction hash 0x...",
      });
    }
    if (values.value.startFrom?.key === "datetime") {
      finalFields.push({
        component: "datetime",
        validation: "date",
        prop: "startDatetime",
        name: "Start from date time",
        placeholder: "Select date and time",
        maxDate: new Date(),
      });
    }
    const directionOptions = [...directionOptionsDefault];
    if (values.value.startFrom?.key !== "latest") {
      directionOptions.push({ id: 2, key: "newer", name: "Newer transactions" });
    }
    finalFields.push({ component: "select", prop: "direction", name: "Search direction", options: directionOptions });
    if (values.value.direction.key === "older") {
      finalFields.push({
        component: "select",
        prop: "finishAt",
        name: "Finish at",
        options: [finishAtOptionOlder, ...finishAtOptionsDefault],
      });
    } else {
      finalFields.push({
        component: "select",
        prop: "finishAt",
        name: "Finish at",
        options: [finishAtOptionNewest, ...finishAtOptionsDefault],
      });
    }
    if (values.value.finishAt?.key === "transaction") {
      finalFields.push({
        component: "input",
        validation: "hash",
        prop: "finishHash",
        name: "Finish at transaction",
        placeholder: "Transaction hash 0x...",
      });
    } else if (values.value.finishAt?.key === "limit") {
      finalFields.push({
        component: "input",
        validation: "number",
        prop: "max",
        name: "Max transactions",
        placeholder: "Transactions amount",
      });
    } else if (values.value.finishAt?.key === "datetime") {
      const newDate = new Date();
      const finishField: FormField<keyof Values> = {
        component: "datetime",
        validation: "date",
        prop: "finishDatetime",
        name: "Finish at date time",
        placeholder: "Select date and time",
        maxDate: newDate,
      };
      if (values.value.startFrom?.key === "datetime" && values.value.startDatetime) {
        if (values.value.direction.key === "older") {
          finishField.maxDate = values.value.startDatetime;
        } else {
          finishField.minDate = values.value.startDatetime;
        }
      }
      finalFields.push(finishField);
    }
    finalFields.push({ component: "select", prop: "dateSort", name: "Date sort", options: dateSortOptions });
    finalFields.push({ component: "toggle", prop: "skipFailed", name: "Skip failed transactions" });
    finalFields.push({ component: "toggle", prop: "removeEmptyColumns", name: "Remove empty columns" });
    finalFields.push({ component: "multiselect", prop: "fields", name: "Columns", options: fieldsOptions });
    return finalFields;
  });
  const areValuesDefault = computed(() => {
    return JSON.stringify({ ...values.value, blockID: null }) === JSON.stringify({ ...defaultValues, blockID: null });
  });

  watch(
    () => JSON.stringify(values.value),
    () => {
      if (values.value.finishAt.key === "oldest") {
        values.value.finishAt = values.value.direction.key === "older" ? finishAtOptionOlder : finishAtOptionNewest;
      }
      if (values.value.startFrom.key === "latest" && values.value.direction.key === "newer") {
        values.value.direction = directionOptionsDefault[0];
      }
      if (
        values.value.startFrom.key === "datetime" &&
        values.value.finishAt.key === "datetime" &&
        values.value.finishDatetime &&
        values.value.startDatetime
      ) {
        if (
          (values.value.direction.key === "older" &&
            new Date(values.value.finishDatetime).getTime() >= new Date(values.value.startDatetime).getTime()) ||
          (values.value.direction.key === "newer" &&
            new Date(values.value.finishDatetime).getTime() <= new Date(values.value.startDatetime).getTime())
        ) {
          values.value.finishDatetime = null;
        }
      }
    }
  );

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
      askToStop.value = false;
      txList.value = [];
      const params = {
        from: "latest",
        direction: searchValues.value.direction.key || "older",
        limit: "100",
      };
      if (isNaN(parseInt(searchValues.value.blockID!))) {
        throw new Error("Valid block ID wasn't provided");
      }
      searchValues.value.blockID = searchValues.value.blockID.trim();
      if (searchValues.value.startFrom.key === "transaction") {
        if (!searchValues.value.startHash) {
          throw new Error("Valid hash to start search from wasn't provided");
        }
        params.from = searchValues.value.startHash.trim();
      } else if (searchValues.value.startFrom.key === "datetime") {
        if (!searchValues.value.startDatetime || !(searchValues.value.startDatetime instanceof Date)) {
          throw new Error("Select a valid start date time");
        }
        params.direction = "older";
      }
      if (searchValues.value.finishAt.key === "transaction") {
        if (!isTransactionHash(searchValues.value.finishHash)) {
          throw new Error("Valid hash to finish at wasn't provided");
        }
        searchValues.value.finishHash = searchValues.value.finishHash.trim();
      } else if (searchValues.value.finishAt.key === "limit") {
        if (!searchValues.value.max) {
          throw new Error("Valid max transactions amount wasn't provided");
        }
        searchValues.value.max = searchValues.value.max.trim();
      } else if (searchValues.value.finishAt.key === "datetime") {
        if (!searchValues.value.finishDatetime || !(searchValues.value.finishDatetime instanceof Date)) {
          throw new Error("Select a valid finish date time");
        }
      }
      if (searchValues.value.fields.length === 0) {
        throw new Error("There should be at least one column to save");
      }
      await tokens.requestTokens();
      if (tokens.requestFail) {
        throw new Error(
          typeof tokens.requestFail === "string" ? tokens.requestFail : "We were not able to request tokens information"
        );
      }
      let nextPaginationTxHash: string | undefined;
      const fetchMore = async () => {
        if (nextPaginationTxHash) {
          params.from = nextPaginationTxHash;
        }
        if (searchValues.value.finishAt.key === "limit") {
          params.limit = Math.min(
            parseInt(searchValues.value.max!) + (params.from === nextPaginationTxHash ? 1 : 0) - txList.value.length,
            100
          ).toString();
        }
        const dataPromise = $fetch(
          `${network.apiDomain}/blocks/${searchValues.value.blockID}/transactions?${new URLSearchParams(params)}`
        );
        const data: Request<ApiTransaction> = (await Promise.all([dataPromise, wait(config.minRequestTime)]))[0];
        if (!data || data.status !== "success") {
          throw new Error(data?.error?.message);
        }
        if (nextPaginationTxHash === data.result.list[0].txHash) {
          data.result.list.splice(0, 1);
        }
        nextPaginationTxHash = data.result.list[data.result.list.length - 1].txHash;
        let continueSearch = data.result.list.length >= parseInt(params.limit) - 1;
        if (searchValues.value.skipFailed) {
          data.result.list = data.result.list.filter((e) => !e.failReason);
        }
        data.result.list.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
        const isStartSearchByDate = searchValues.value.startFrom.key === "datetime";
        const isFinishSearchByDate = searchValues.value.finishAt.key === "datetime";
        let actualStartDateTime = 8640000000000000;
        let actualFinishDateTime = 0;
        if (isStartSearchByDate) {
          if (searchValues.value.direction.key === "older") {
            actualStartDateTime = new Date(searchValues.value.startDatetime!).getTime();
          } else {
            actualFinishDateTime = new Date(searchValues.value.startDatetime!).getTime();
          }
        }
        if (isFinishSearchByDate) {
          if (searchValues.value.direction.key === "older") {
            actualFinishDateTime = new Date(searchValues.value.finishDatetime!).getTime();
          } else {
            actualStartDateTime = new Date(searchValues.value.finishDatetime!).getTime();
          }
        }
        if (isStartSearchByDate || isFinishSearchByDate) {
          for (let a = data.result.list.length - 1; a >= 0; a--) {
            if (typeof data.result.list[a].createdAt !== "string") {
              continue;
            }
            const txDateTime = new Date(data.result.list[a].createdAt!).getTime();
            if (txDateTime > actualStartDateTime) {
              data.result.list.splice(a, 1);
            } else if (txDateTime < actualStartDateTime && txDateTime > actualFinishDateTime) {
              continue;
            } else if (txDateTime < actualFinishDateTime) {
              data.result.list.splice(0, a + 1);
              continueSearch = false;
              break;
            }
          }
        }
        if (searchValues.value.finishAt.key === "transaction") {
          for (let a = 0; a < data.result.list.length; a++) {
            if (data.result.list[a].txHash === searchValues.value.finishHash) {
              data.result.list.splice(0, a);
              continueSearch = false;
              break;
            }
          }
        } else if (searchValues.value.finishAt.key === "limit") {
          if (txList.value.length + data.result.list.length >= parseInt(searchValues.value.max!)) {
            continueSearch = false;
          }
        }
        txList.value.push(...data.result.list);
        if (continueSearch && !askToStop.value) {
          await fetchMore();
        }
      };
      await fetchMore();
      isRequestSuccessful.value = true;
    } catch (error: unknown) {
      console.warn("Block transaction search error", error);
      requestFail.value = (error as any)?.toString() || true;
    } finally {
      isRequestPending.value = false;
    }
  }

  function download() {
    downloadData(
      getTransactionsTableData(txList.value, {
        dateSort: searchValues.value.dateSort.key as "descending" | "ascending",
        skipFailed: searchValues.value.skipFailed,
        removeEmptyColumns: searchValues.value.removeEmptyColumns,
        fields: values.value.fields,
      }),
      `Transactions_${searchValues.value.blockID}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`
    );
  }

  return {
    isRequestPending,
    requestFail,
    isRequestSuccessful,
    askToStop,
    values,
    searchValues,
    requiredFields,
    fields,
    txList,
    areValuesDefault,
    resetValues,
    resetSearchValues,
    searchWithSelectedSettings,
    search,
    download,
  };
});
