<template>
  <div>
    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <table class="min-w-full">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  :checked="selectedRowsAmount === rows.length && selectedRowsAmount > 0"
                  ref="checkAll"
                  @input="selectAllClicked"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600"
                />
              </div>
            </th>
            <th
              v-for="(col, index) in headers"
              :key="index"
              scope="col"
              class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
            >
              <slot name="header-cols" :col="col"></slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b transition first:border-t odd:bg-white even:bg-gray-50 hover:odd:bg-gray-100 hover:even:bg-gray-200"
            v-for="(row, index) in rows"
            :key="row.key"
          >
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  v-model="selectedRows.value[index]"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600"
                />
              </div>
            </td>
            <td
              class="whitespace-nowrap py-4 px-6 text-sm text-gray-600 first:font-medium first:text-gray-900"
              v-for="(col, colIndex) in headers"
              :key="colIndex"
            >
              <slot name="body-cols" :col="col" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex w-full flex-col py-3 px-4">
        <div
          @click="deleteRows"
          class="text-md sticky right-0 flex items-center font-medium transition"
          :class="[
            selectedRowsAmount > 0
              ? 'cursor-pointer text-red-400 hover:text-red-300'
              : 'cursor-not-allowed text-red-300',
          ]"
        >
          <div class="mr-1">Удалить</div>
          <TrashIcon class="h-5 w-5 flex-shrink-0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, type PropType } from "vue";
import type { TableHeader, TableRow } from "../../types";
import { TrashIcon } from "@heroicons/vue/outline";

const props = defineProps({
  headers: {
    type: Array as PropType<TableHeader[]>,
    default: () => [],
    required: true,
  },
  rows: {
    type: Array as PropType<TableRow[]>,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "selected", rows: TableRow[]): void;
  (eventName: "deleted", rows: TableRow[]): void;
}>();

const selectedRows = reactive({ value: new Array(props.rows.length).fill(false) } as { value: Array<boolean> });

const selectedRowsAmount = computed(() => {
  return selectedRows.value.filter((e) => e === true).length;
});

watch([props.rows], () => {
  selectedRows.value = new Array(props.rows.length).fill(false);
});

watch([selectedRows], (val) => {
  emit(
    "selected",
    val[0].value
      .map((value, index) => ({ value, index }))
      .filter((e) => e.value === true)
      .map((e) => props.rows[e.index])
  );
});

function selectAllClicked() {
  if (selectedRowsAmount.value !== props.rows.length) {
    selectedRows.value = new Array(props.rows.length).fill(true);
  } else {
    selectedRows.value = new Array(props.rows.length).fill(false);
  }
}

function deleteRows() {
  if (selectedRowsAmount.value > 0) {
    emit(
      "deleted",
      selectedRows.value
        .map((value, index) => ({ value, index }))
        .filter((e) => e.value === true)
        .map((e) => props.rows[e.index])
    );
  }
  selectedRows.value = new Array(props.rows.length).fill(false);
}
</script>
