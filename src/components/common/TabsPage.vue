<template>
  <div>
    <div>
      <main class="mx-auto max-w-7xl px-8">
        <div class="relativ flex items-baseline justify-between border-b border-gray-200 pt-4 pb-6">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{{ name }}</h1>
        </div>

        <section class="pt-6 pb-24">
          <div class="grid grid-cols-4 gap-x-8 gap-y-10">
            <form>
              <ul role="list" class="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                <li v-for="category in tabs" :key="category.name">
                  <router-link class="tabListItemLink" :to="category.to">
                    {{ category.name }}
                  </router-link>
                </li>
              </ul>
            </form>
            <div class="col-span-3">
              <slot />
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { TabsPageTabs } from "../../types";
defineProps({
  name: {
    type: String,
    default: "",
    required: true,
  },
  tabs: {
    type: Array as PropType<TabsPageTabs>,
    default: () => [],
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.tabListItemLink.router-link-exact-active {
  @apply text-orange-500;
}
</style>
