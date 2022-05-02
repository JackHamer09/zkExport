<template>
  <CardQuickActions>
    <template #default>
      <dl>
        <template v-for="item in requiredFields" :key="item.prop">
          <Field :field="item" v-model="(values as any)[item.prop]" />
        </template>
      </dl>
      <div class="quick-actions-divider"></div>
      <Day />
      <div class="quick-actions-divider"></div>
      <Month />
      <div class="quick-actions-divider"></div>
      <Year />
      <div class="quick-actions-divider"></div>
      <Interval />
    </template>
  </CardQuickActions>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import Day from "./Day.vue";
import Month from "./Month.vue";
import Year from "./Year.vue";
import Interval from "./Interval.vue";
import CardQuickActions from "@/components/common/CardQuickActions.vue";
import Field from "@/components/common/Field.vue";
import useAccountTransactions from "@/store/accountTransactions";

const accountTransactions = useAccountTransactions();
const { requiredFields, values } = storeToRefs(accountTransactions);
</script>
