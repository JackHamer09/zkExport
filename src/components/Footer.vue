<template>
  <footer class="footer bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
    <div class="md:flex md:justify-between">
      <div class="mb-6 md:mb-0">
        <router-link :to="{ name: 'home' }">
          <span class="flex items-center text-2xl font-bold text-indigo-600">
            <span class="text-indigo-300">zk</span>Export
          </span>
        </router-link>
      </div>
      <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
        <div v-for="(item, index) in links" :key="index">
          <ul class="text-sm text-gray-400">
            <li v-for="link in item.routes" :key="link.name" class="mb-2">
              <router-link :to="{ name: link.name }" class="footer-link">{{ link.meta.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr class="my-4 border-indigo-50 sm:mx-auto" />
    <div class="flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between">
      <span class="text-center text-sm text-gray-400">
        Made with ❤️ by
        <a
          class="font-medium text-indigo-600 hover:underline"
          href="https://github.com/JackHamer09"
          target="_blank"
          rel="noopener"
        >
          JackHamer
        </a>
      </span>
      <div class="mt-4 flex justify-center space-x-6 sm:mt-0">
        <a
          href="https://github.com/JackHamer09/zkexport"
          target="_blank"
          rel="noopener"
          class="flex items-center text-gray-500 hover:text-gray-900"
        >
          <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="ml-2 text-sm">zkExport GitHub Page</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { accountRoutes, blockRoutes } from "@/router";

const links = computed(() => [
  {
    label: "Account",
    routes: accountRoutes,
  },
  {
    label: "Block",
    routes: blockRoutes,
  },
]);
</script>

<style lang="scss" scoped>
.footer-link {
  &.router-link-exact-active {
    @apply font-semibold;
  }
  &:not(.router-link-exact-active) {
    @apply hover:underline;
  }
}
</style>
