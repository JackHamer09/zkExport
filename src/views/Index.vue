<template>
  <div class="home-page">
    <div class="logo"><span>zk</span>Export</div>
    <h1 class="title">
      <span class="sr-only">zkExport - </span>
      zkSync mass export tool
      <span class="sr-only">Export transactions to CSV, XLS</span>
    </h1>
    <router-link :to="{ name: 'export-account-transactions' }" @click.passive="logEvent('Home screen button clicked')">
      <Button size="lg" class="mt-8">
        <span>Try now</span>
        <ArrowRightIcon class="ml-4 -mr-1 h-6 w-6 sm:h-8 sm:w-8" />
      </Button>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import Button from "@/components/common/Button.vue";
import { ArrowRightIcon } from "@heroicons/vue/solid";
import { logEvent } from "@/utils/logger";
</script>

<style lang="scss" scoped>
.home-page {
  @apply flex h-full flex-col items-center justify-center pt-10 text-center;

  .logo {
    @apply text-5xl font-bold text-white sm:text-7xl;

    span {
      @apply text-indigo-300;
    }
  }
  .title {
    @apply mt-3 max-w-[18rem] text-3xl font-semibold text-gray-50 sm:mt-5 sm:max-w-full md:text-5xl;
  }
}
</style>
