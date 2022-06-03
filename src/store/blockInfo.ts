import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { format } from "date-fns";
import type { ApiBlockInfo } from "zksync/build/types";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";
import type { FormField } from "@/components/common/Field.vue";
import { logError } from "@/utils/logger";
import getError from "@/utils/errors";
import { blockInfoKeys, fieldsNames, type BlockInfoNameKeys } from "@/utils/fields";
import { getBlockInfoTableData } from "@/utils/tableData";
import { downloadData } from "@/utils/download";
import { requestBlock } from "@/utils/requests";

export type Values = {
  blockID: null | string;
  fields: BlockInfoNameKeys[];
};

const defaultFields = <Set<BlockInfoNameKeys>>(
  new Set([
    "blockNumber",
    "blockSize",
    "commitTxHash",
    "committedAt",
    "finalizedAt",
    "blockStatus",
    "verifyTxHash",
    "newStateRoot",
  ])
);
const fieldsOptions: MultiSelectOption[] = blockInfoKeys.map((key, index) => ({
  id: index,
  value: key,
  label: fieldsNames[key],
  default: defaultFields.has(key as BlockInfoNameKeys),
}));

export default defineStore("blockInfo", () => {
  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const isRequestSuccessful = ref(false);

  const defaultValues: Values = {
    blockID: null,
    fields: fieldsOptions.filter((e) => e.default === true).map((e) => e.value as BlockInfoNameKeys),
  };
  const values = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const searchValues = ref(<Values>JSON.parse(JSON.stringify(defaultValues)));
  const block = ref(<ApiBlockInfo | null>null);

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
  const fields = computed(
    () =>
      <FormField<keyof Values>[]>[{ component: "multiselect", prop: "fields", name: "Columns", options: fieldsOptions }]
  );
  const areValuesDefault = computed(() => {
    return JSON.stringify({ ...values.value, blockID: null }) === JSON.stringify({ ...defaultValues, blockID: null });
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
      block.value = null;
      if (isNaN(parseInt(searchValues.value.blockID!))) {
        throw new Error(getError("INVALID_BLOCK_ID_INPUTTED"));
      }
      searchValues.value.blockID = searchValues.value.blockID!.trim();
      if (searchValues.value.fields.length === 0) {
        throw new Error(getError("ZERO_FIELDS_INPUTTED"));
      }
      block.value = await requestBlock(searchValues.value.blockID!);
      isRequestSuccessful.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logError("Block search error: " + error);
      requestFail.value = (error && error.message ? error.message : error) || true;
    } finally {
      isRequestPending.value = false;
    }
  }

  function download() {
    downloadData(
      getBlockInfoTableData(block.value!, {
        fields: values.value.fields,
      }),
      `Block_${searchValues.value.blockID}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`
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
    block,
    areValuesDefault,
    resetValues,
    resetSearchValues,
    searchWithSelectedSettings,
    search,
    download,
  };
});
