<template>
  <Popover class="header gradient-bg relative">
    <DonateModal v-model:value="donateModalOpened" />
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between py-5 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link :to="{ name: 'home' }">
            <span class="logo flex items-center"><span>zk</span>Export</span>
          </router-link>
        </div>
        <div class="-my-2 -mr-2 md:hidden">
          <PopoverButton
            class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open menu</span>
            <MenuIcon class="h-6 w-6" aria-hidden="true" />
          </PopoverButton>
        </div>
        <PopoverGroup as="nav" class="hidden space-x-10 md:flex">
          <Popover v-for="(item, index) in links" :key="index" class="relative" v-slot="{ open }">
            <PopoverButton
              :class="[
                open ? 'text-indigo-200' : 'text-white',
                'group inline-flex items-center rounded-md text-base font-medium transition-colors hover:text-indigo-200 focus:outline-none',
              ]"
            >
              <span>{{ item.label }}</span>
              <ChevronDownIcon
                :class="[
                  open ? 'text-indigo-200' : 'text-white',
                  'ml-2 block h-5 w-5 transition-colors group-hover:text-indigo-200',
                ]"
                aria-hidden="true"
              />
            </PopoverButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2"
              >
                <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    <PopoverButton as="template" v-for="link in item.routes" :key="link.name">
                      <router-link
                        :to="{ name: link.name }"
                        class="desktop-link -m-3 flex items-start rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <component
                          :is="link.meta.icon"
                          class="link-icon h-6 w-6 flex-shrink-0 text-indigo-600"
                          aria-hidden="true"
                        />
                        <div class="ml-4">
                          <p class="link-name text-base font-medium text-gray-900">
                            {{ link.meta.label }}
                          </p>
                          <p class="link-description mt-1 text-sm text-gray-500">
                            {{ link.meta.description }}
                          </p>
                        </div>
                      </router-link>
                    </PopoverButton>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>
        </PopoverGroup>
        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <NetworkSwitch class="z-10" />
          <Button class="ml-2" size="sm" @click="donateModalOpened = true">
            <HeartIcon class="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
            <span class="leading-[22px]">Buy me a coffee</span>
          </Button>
        </div>
      </div>
      <div class="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-indigo-500 to-indigo-400"></div>
    </div>

    <div class="gradient-bg absolute left-0 top-full flex h-56 w-full items-end justify-end overflow-hidden"></div>

    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <PopoverPanel
        focus
        class="mobile-header absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
      >
        <div class="divide-y-2 divide-gray-100 rounded-lg bg-white shadow-xl">
          <div class="px-5 pt-5 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <router-link :to="{ name: 'home' }">
                  <span class="logo flex items-center"><span>zk</span>Export</span>
                </router-link>
              </div>
              <div class="-mr-2">
                <PopoverButton
                  class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span class="sr-only">Close menu</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </PopoverButton>
              </div>
            </div>
            <div class="mt-6">
              <nav class="grid gap-y-8">
                <template v-for="(item, index) in links" :key="index">
                  <PopoverButton as="template" v-for="link in item.routes" :key="`${index}-${link.name}`">
                    <router-link
                      :to="{ name: link.name }"
                      class="desktop-link -m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                    >
                      <component
                        :is="link.meta.icon"
                        class="link-icon h-6 w-6 flex-shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span class="link-name ml-3 text-base font-medium text-gray-900">
                        {{ link.meta.label }}
                      </span>
                    </router-link>
                  </PopoverButton>
                </template>
              </nav>
            </div>
          </div>
          <div class="grid-cols-[max-content_1fr] items-center space-y-3 py-6 px-5 sm:grid sm:gap-4 sm:space-y-0">
            <Button class="w-full" size="sm" @click="donateModalOpened = true">
              <HeartIcon class="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
              <span class="leading-[22px]">Buy me a coffee</span>
            </Button>
            <NetworkSwitch class="z-10" />
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/vue";
import { MenuIcon, XIcon, HeartIcon } from "@heroicons/vue/outline";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { accountRoutes, blockRoutes } from "@/router";
import { logEvent } from "@/utils/logger";
import NetworkSwitch from "@/components/NetworkSwitch.vue";
import DonateModal from "@/components/DonateModal.vue";
import Button from "@/components/common/Button.vue";

const donateModalOpened = ref(false);

watch(donateModalOpened, (opened) => {
  logEvent("Donate modal", { opened });
});

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

<style lang="scss">
.header {
  .logo {
    @apply text-2xl font-bold text-white;

    span {
      @apply text-indigo-300;
    }
  }
  &.gradient-bg,
  .gradient-bg {
    @apply bg-gradient-to-r from-indigo-600 to-indigo-500;
  }
  .desktop-link.router-link-exact-active {
    @apply bg-gradient-to-r from-indigo-700 to-indigo-500 shadow-lg;

    .link-icon,
    .link-name,
    .link-description {
      @apply text-white;
    }
  }
}
.mobile-header {
  .logo {
    @apply text-indigo-600;
  }
}
</style>
