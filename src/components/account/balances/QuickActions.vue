<template>
  <CardQuickActions>
    <template #default>
      <dl>
        <template v-for="item in requiredFields" :key="item.prop">
          <Field :field="item" v-model="(values as any)[item.prop]" />
        </template>
      </dl>
      <div class="quick-actions-divider"></div>
      <div class="quick-action-group">
        <div class="quick-actions-group-headline">Status</div>
        <div class="quick-actions-grid">
          <button
            class="quick-action-button"
            @click="getCommittedBalances"
            @click.passive="logEvent('Fetch account committed balances clicked', values)"
          >
            <div class="action-name">Committed balances</div>
            <p class="action-description">Get all committed balances <span class="font-medium">(recommended)</span></p>
          </button>
          <button
            class="quick-action-button"
            @click="getVerifiedBalances"
            @click.passive="logEvent('Fetch account verified balances clicked', values)"
          >
            <div class="action-name">Verified balances</div>
            <p class="action-description">Get all verified balances</p>
          </button>
        </div>
      </div>
    </template>
  </CardQuickActions>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import CardQuickActions from "@/components/common/CardQuickActions.vue";
import Field from "@/components/common/Field.vue";
import { logEvent } from "@/utils/logger";
import useAccountBalances, { balancesToExportOptions } from "@/store/accountBalances";

const accountBalances = useAccountBalances();
const { requiredFields, values, searchValues } = storeToRefs(accountBalances);

function getBalances(type: "committed" | "finalized") {
  accountBalances.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    balancesToExport: balancesToExportOptions.find((e) => e.key === type)!,
  };
  accountBalances.search();
}

function getCommittedBalances() {
  getBalances("committed");
}

function getVerifiedBalances() {
  getBalances("finalized");
}
</script>
