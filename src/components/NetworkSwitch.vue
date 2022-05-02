<template>
  <Menu as="div" class="network-switch">
    <div>
      <MenuButton
        class="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 md:border-0 md:bg-indigo-600 md:font-medium md:text-white md:hover:bg-indigo-700 md:focus:ring-indigo-500 md:focus:ring-offset-indigo-400"
      >
        <div class="mr-1 -ml-1 h-6 w-6 overflow-hidden">
          <img src="@/assets/imgs/eth.svg" alt="Ethereum network" class="h-full w-max object-cover" />
        </div>
        <span>{{ network.selectedNetwork.label }}</span>
        <ChevronDownIcon class="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <MenuItems
        class="absolute left-0 right-0 mx-auto mt-2 w-full max-w-xs origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:left-auto md:mx-0 md:w-52"
      >
        <div class="py-1">
          <MenuItem
            v-for="item in network.zkNetworkOptions"
            :key="item.name"
            :class="{ selected: item.name === network.selectedNetwork.name }"
            class="network-item"
            v-slot="{ active }"
            @click="network.setNetwork(item.name)"
          >
            <div
              :class="[
                active && item.name !== network.selectedNetwork.name
                  ? 'bg-gray-100 text-gray-900'
                  : item.name === network.selectedNetwork.name
                  ? 'font-medium text-white'
                  : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
            >
              {{ item.label }}
              <CheckIcon v-if="item.name === network.selectedNetwork.name" class="check-icon" aria-hidden="true" />
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon, CheckIcon, SelectorIcon } from "@heroicons/vue/outline";
import useNetwork from "@/store/network";

const network = useNetwork();
</script>

<style lang="scss" scoped>
.network-switch {
  @apply relative text-left;

  .network-item {
    @apply relative cursor-pointer;
    &.selected {
      @apply bg-gradient-to-r from-indigo-600 to-indigo-500;
    }

    .check-icon {
      @apply absolute top-0 bottom-0 right-3 my-auto h-5 w-5;
    }
  }
}
</style>
