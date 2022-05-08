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
        <div class="quick-actions-group-headline">Type</div>
        <div class="quick-actions-grid">
          <button
            class="quick-action-button"
            @click="getOwnedNFTs"
            @click.passive="logEvent('Fetch account owned NFTs clicked', values)"
          >
            <div class="action-name">Owned NFTs</div>
            <p class="action-description">Get all owned NFTs</p>
          </button>
          <button
            class="quick-action-button"
            @click="getMintedNFTs"
            @click.passive="logEvent('Fetch account minted NFTs clicked', values)"
          >
            <div class="action-name">Minted NFTs</div>
            <p class="action-description">Get all minted NFTs</p>
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
import useAccountNFTs, { nftsToExportOptions } from "@/store/accountNFTs";

const accountNFTs = useAccountNFTs();
const { requiredFields, values, searchValues } = storeToRefs(accountNFTs);

function getBalances(type: "nfts" | "mintedNfts") {
  accountNFTs.resetSearchValues();
  searchValues.value = {
    ...searchValues.value,
    address: values.value.address,
    nftsToExport: nftsToExportOptions.find((e) => e.key === type)!,
  };
  accountNFTs.search();
}

function getOwnedNFTs() {
  getBalances("nfts");
}

function getMintedNFTs() {
  getBalances("mintedNfts");
}
</script>
