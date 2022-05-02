<template>
  <Alert v-if="!network.isMainnet" color="warning">
    <span class="font-medium">{{ network.selectedNetwork.name }} Testnet is selected.</span>
    <br />If you wan't to use mainnet then you should change it in the header menu.
  </Alert>
</template>

<script lang="ts" setup>
import Alert from "@/components/common/Alert.vue";
import useNetwork from "@/store/network";

const network = useNetwork();
</script>
