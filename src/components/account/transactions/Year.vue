<template>
  <div class="quick-action-group">
    <div class="quick-actions-group-headline">Year</div>
    <div class="quick-actions-grid">
      <button
        class="quick-action-button"
        @click="getThisYear"
        @click.passive="logEvent('Fetch account transactions for the current year clicked', values)"
      >
        <div class="action-name">This year</div>
        <p class="action-description">Get all transactions for {{ formatDate(thisYear) }}</p>
      </button>
      <button
        class="quick-action-button"
        @click="getPreviousYear"
        @click.passive="logEvent('Fetch account transactions for the previous year clicked', values)"
      >
        <div class="action-name">Previous year</div>
        <p class="action-description">Get all transactions for {{ formatDate(previousYear) }}</p>
      </button>
      <div class="quick-action-button custom-select">
        <div class="action-text-content">
          <div class="action-name">Choose custom year</div>
          <p class="action-description">Get all transactions for</p>
        </div>
        <div class="middle-col place-self-end sm:max-w-[11rem]">
          <Select v-model="chosenYear" :options="yearOptions" />
        </div>
        <Button
          size="md"
          class="w-full"
          @click="getCustom"
          @click.passive="
            logEvent('Fetch account transactions for the custom year clicked', {
              chosenYear: chosenYear.key,
              ...values,
            })
          "
        >
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
import { format, startOfToday, startOfYear, endOfYear, subYears, setYear } from "date-fns";
import { SearchIcon } from "@heroicons/vue/outline";
import Button from "@/components/common/Button.vue";
import Select, { type SelectOption } from "@/components/common/Select.vue";
import { logEvent } from "@/utils/logger";
import { getYearOptions } from "@/utils/helpers";
import useAccountTransactions, { startFromOptions, finishAtOptionsDefault } from "@/store/accountTransactions";

const accountTransactions = useAccountTransactions();
const { values, searchValues } = storeToRefs(accountTransactions);

const thisYear = startOfYear(startOfToday());
const previousYear = subYears(thisYear, 1);

const yearOptions: SelectOption[] = getYearOptions().map((year, index) => ({
  id: index,
  key: year.toString(),
  name: year.toString(),
}));
const chosenYear = ref(yearOptions[yearOptions.length - 1]);

function formatDate(date: Date) {
  return format(date, "yyyy");
}

function getYear(date: Date) {
  accountTransactions.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    startFrom: startFromOptions.find((e) => e.key === "datetime")!,
    startDatetime: endOfYear(date),
    finishAt: finishAtOptionsDefault.find((e) => e.key === "datetime")!,
    finishDatetime: startOfYear(date),
  };
  accountTransactions.search();
}
function getThisYear() {
  getYear(thisYear);
}
function getPreviousYear() {
  getYear(previousYear);
}
function getCustom() {
  const selectedYear = setYear(thisYear, parseInt(chosenYear.value.key));
  getYear(selectedYear);
}
</script>
