<template>
  <div class="quick-action-group">
    <div class="quick-actions-group-headline">Month</div>
    <div class="quick-actions-grid">
      <button class="quick-action-button" @click="getThisMonth">
        <div class="action-name">This month</div>
        <p class="action-description">Get all transactions for {{ formatDate(thisMonth) }}</p>
      </button>
      <button class="quick-action-button" @click="getPreviousMonth">
        <div class="action-name">Previous month</div>
        <p class="action-description">Get all transactions for {{ formatDate(previousMonth) }}</p>
      </button>
      <div class="quick-action-button custom-select">
        <div class="action-text-content">
          <div class="action-name">Choose custom month</div>
          <p class="action-description">Get all transactions for</p>
        </div>
        <div class="middle-col grid grid-cols-5 gap-2">
          <Select class="col-span-3" v-model="chosenMonth" :options="monthOptions" />
          <Select class="col-span-2" v-model="chosenYear" :options="yearOptions" />
        </div>
        <Button @click="getCustom" size="md" class="w-full">
          <SearchIcon class="-ml-1 mr-2 h-4 w-4" />
          Fetch
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { format, startOfToday, startOfMonth, endOfMonth, subMonths, setMonth, setYear } from "date-fns";
import { SearchIcon } from "@heroicons/vue/outline";
import Button from "@/components/common/Button.vue";
import Select, { type SelectOption } from "@/components/common/Select.vue";
import useAccountTransactions, { startFromOptions, finishAtOptionsDefault } from "@/store/accountTransactions";
import { getMonthsOptions, getYearOptions } from "@/utils/helpers";

const accountTransactions = useAccountTransactions();
const { values, searchValues } = storeToRefs(accountTransactions);

const thisMonth = startOfMonth(startOfToday());
const previousMonth = subMonths(thisMonth, 1);

const monthOptions: SelectOption[] = getMonthsOptions().map((monthName, index) => ({
  id: index + 1,
  key: index.toString(),
  name: monthName,
}));
const yearOptions: SelectOption[] = getYearOptions().map((year, index) => ({
  id: index,
  key: year.toString(),
  name: year.toString(),
}));
const chosenMonth = ref(monthOptions.find((e) => parseInt(e.key) === thisMonth.getMonth())!);
const chosenYear = ref(yearOptions[yearOptions.length - 1]);

function formatDate(date: Date) {
  return format(date, "MMMM yyyy");
}

function getMonth(date: Date) {
  accountTransactions.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    startFrom: startFromOptions.find((e) => e.key === "datetime")!,
    startDatetime: endOfMonth(date),
    finishAt: finishAtOptionsDefault.find((e) => e.key === "datetime")!,
    finishDatetime: startOfMonth(date),
  };
  accountTransactions.search();
}
function getThisMonth() {
  getMonth(thisMonth);
}
function getPreviousMonth() {
  getMonth(previousMonth);
}
function getCustom() {
  const selectedMonth = setMonth(setYear(thisMonth, parseInt(chosenYear.value.key)), parseInt(chosenMonth.value.key));
  getMonth(selectedMonth);
}
</script>
