<template>
  <div class="quick-action-group">
    <div class="quick-actions-group-headline">Custom interval</div>
    <div class="quick-actions-grid">
      <div class="quick-action-button custom-select">
        <div class="action-text-content">
          <div class="action-name">Choose custom interval</div>
          <p class="action-description">Get all transactions for</p>
        </div>
        <DatePicker
          class="middle-col"
          color="indigo"
          is-range
          :min-date="minYearDate"
          :max-date="today"
          v-model="chosenDate"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <div class="middle-col grid grid-cols-2 gap-2">
              <Input :model-value="inputValue.start" placeholder="Start date" v-on="inputEvents.start" />
              <Input :model-value="inputValue.end" placeholder="End date" v-on="inputEvents.end" />
            </div>
          </template>
        </DatePicker>
        <Button
          @click="getInterval"
          @click.passive="
            logEvent('Fetch account transactions for the custom interval clicked', {
              chosenDateStart: chosenDate.start,
              chosenDateEnd: chosenDate.end,
              ...values,
            })
          "
          :disabled="!chosenDate.start || !chosenDate.end"
          size="md"
          class="w-full"
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
import { endOfDay, startOfDay, startOfToday } from "date-fns";
import { SearchIcon } from "@heroicons/vue/outline";
import { DatePicker } from "v-calendar";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";
import { logEvent } from "@/utils/logger";
import { minYearDate } from "@/utils/helpers";
import useAccountTransactions, { startFromOptions, finishAtOptionsDefault } from "@/store/accountTransactions";

const accountTransactions = useAccountTransactions();
const { values, searchValues } = storeToRefs(accountTransactions);

const today = startOfToday();

const chosenDate = ref({ start: null, end: null } as { start: Date | null; end: Date | null });

function getInterval() {
  accountTransactions.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    startFrom: startFromOptions.find((e) => e.key === "datetime")!,
    startDatetime: endOfDay(chosenDate.value.end!),
    finishAt: finishAtOptionsDefault.find((e) => e.key === "datetime")!,
    finishDatetime: startOfDay(chosenDate.value.start!),
  };
  accountTransactions.search();
}
</script>
