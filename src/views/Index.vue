<template>
  <div class="home-page">
    <div class="mb-3 flex justify-center">
      <div
        class="relative rounded-xl px-5 py-1 text-sm leading-6 text-white ring-1 ring-white/10 transition-colors hover:ring-white/20 sm:rounded-full sm:px-3"
      >
        Need to do your crypto taxes?
        <a
          href="https://awaken.tax/?ref=zkexport"
          target="_blank"
          class="block font-semibold text-indigo-100 sm:inline"
          @click.passive="logEvent('awaken.tax clicked')"
        >
          <span class="absolute inset-0" aria-hidden="true" />Try awaken.tax
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
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
