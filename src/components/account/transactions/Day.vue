<template>
  <div class="quick-action-group">
    <div class="quick-actions-group-headline">Day</div>
    <div class="quick-actions-grid">
      <button class="quick-action-button" @click="getToday">
        <div class="action-name">Today</div>
        <p class="action-description">Get all transactions for {{ formatDate(today) }}</p>
      </button>
      <button class="quick-action-button" @click="getYesterday">
        <div class="action-name">Yesterday</div>
        <p class="action-description">Get all transactions for {{ formatDate(yesterday) }}</p>
      </button>
      <div class="quick-action-button custom-select">
        <div class="action-text-content">
          <div class="action-name">Choose custom day</div>
          <p class="action-description">Get all transactions for</p>
        </div>
        <div class="middle-col place-self-end sm:max-w-[11rem]">
          <DatePicker class="w-full" color="indigo" :min-date="minYearDate" :max-date="today" v-model="chosenDate">
            <template v-slot="{ inputValue, inputEvents }">
              <Input :model-value="inputValue" placeholder="Choose the date" v-on="inputEvents" />
            </template>
          </DatePicker>
        </div>
        <Button @click="getCustom" :disabled="!chosenDate" size="md" class="w-full">
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
import { format, endOfDay, startOfDay, startOfToday, startOfYesterday } from "date-fns";
import { SearchIcon } from "@heroicons/vue/outline";
import { DatePicker } from "v-calendar";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import { minYearDate } from "@/utils/helpers";
import useAccountTransactions, { startFromOptions, finishAtOptionsDefault } from "@/store/accountTransactions";

const accountTransactions = useAccountTransactions();
const { values, searchValues } = storeToRefs(accountTransactions);

const today = startOfToday();
const yesterday = startOfYesterday();

const chosenDate = ref(null as null | Date);

function formatDate(date: Date) {
  return format(date, "dd MMMM yyyy");
}

function getDay(date: Date) {
  accountTransactions.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    startFrom: startFromOptions.find((e) => e.key === "datetime")!,
    startDatetime: endOfDay(date),
    finishAt: finishAtOptionsDefault.find((e) => e.key === "datetime")!,
    finishDatetime: startOfDay(date),
  };
  accountTransactions.search();
}
function getToday() {
  getDay(today);
}
function getYesterday() {
  getDay(yesterday);
}
function getCustom() {
  getDay(chosenDate.value!);
}
</script>
