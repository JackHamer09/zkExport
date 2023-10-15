<template>
  <div class="container flex items-center">
    <DownloadModal
      v-model:open="modalOpened"
      :status="status"
      :fetched-total="fetchedTotal"
      :total="total"
      :limit="limit"
      :error="error"
      @continue="continueFetch"
      @stop="stopFetch"
      @download="download"
    />
    <Hero
      v-model="accountAddress"
      input-placeholder="Enter 0x address"
      input-pattern="^0x[a-fA-F0-9]{40}$"
      @submit="search"
    />
  </div>
</template>

<script lang="ts" setup>
import useDownloadTransfers from "@/composables/download/useDownloadTransfers";

useHead({
  title: "zkExport - Export zkSync Era transactions to CSV and more",
  meta: [
    { name: "description", content: "Export zkSync Era and Lite transaction to CSV, XLSX and other table formats" },
    { name: "og:title", content: "zkExport - Export zkSync Era transactions to CSV and more" },
    { name: "og:description", content: "Export zkSync Era and Lite transaction to CSV, XLSX and other table formats" },
  ],
});

const accountAddress = ref("");
const {
  fetchedTotal,
  total,
  error,

  status,
  limit,
  startFetch,
  stopFetch,
  continueFetch,
  download,
} = useDownloadTransfers();

const modalOpened = computed({
  get: () => status.value !== "not-started",
  set: (state: boolean) => {
    if (!state) {
      status.value = "not-started";
    }
  },
});

const search = () => {
  startFetch(accountAddress.value);
  trackEvent(useGtag().gtag, "Fetch transactions");
};
</script>

<style lang="scss" scoped></style>
