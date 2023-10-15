<template>
  <DonateModal v-model:open="opened" />
  <button class="donate-button" @click="opened = true">
    <HeartIcon class="donate-button-icon" aria-hidden="true" />
    <span>Buy me a coffee</span>
  </button>
</template>

<script lang="ts" setup>
import { HeartIcon } from "@heroicons/vue/24/outline";

const opened = ref(false);

watch(opened, (state) => {
  if (state) {
    trackEvent(useGtag().gtag, "Donate modal");
  }
});
</script>

<style scoped lang="scss">
.donate-button {
  @apply flex h-9 items-center gap-1.5 whitespace-nowrap rounded-3xl bg-white p-1 px-3 py-1.5 text-sm shadow-md shadow-blue-800/5 ring-1 ring-pink-600/[.25] transition;
  @apply hover:shadow-md hover:shadow-blue-800/5 hover:ring-pink-400;

  .donate-button-icon {
    @apply aspect-square h-full w-auto p-0.5 text-pink-600;
  }
}
</style>
