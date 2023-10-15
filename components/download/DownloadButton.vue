<template>
  <div class="download-button-container">
    <CommonButton :icon="ArrowDownTrayIcon" class="download-button-main" @click="emit('click')">
      <slot />
    </CommonButton>
    <Menu as="div" class="relative -ml-px block">
      <MenuButton type="button" :as="CommonButton" title="Open options" class="download-button-select">
        <span>.{{ downloadFormat.name }}</span>
        <ChevronDownIcon class="-mr-0.5 ml-1 h-5 w-5" aria-hidden="true" />
      </MenuButton>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="absolute bottom-full right-0 z-10 mb-2 w-28 origin-bottom-right rounded-2xl bg-white shadow-md shadow-blue-800/5 ring-1 ring-gray-600/[.15] focus:outline-none"
        >
          <div class="p-1">
            <MenuItem v-for="item in [...fileFormatOptions].reverse()" :key="item.key" v-slot="{ active }">
              <button
                :href="item.key"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'flex w-full items-center justify-between rounded-3xl px-4 py-2 text-left text-sm',
                ]"
                @click="setDownloadFormat(item.key)"
              >
                <span :class="{ 'font-medium': isFormatSelected(item.key) }">{{ item.name }}</span>
                <CheckIcon v-if="isFormatSelected(item.key)" class="h-4 w-4" />
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import CommonButton from "@/components/common/button/Button.vue";

const { setDownloadFormat } = usePreferencesStore();
const { downloadFormat } = storeToRefs(usePreferencesStore());

const emit = defineEmits<{
  (eventName: "click"): void;
}>();

const isFormatSelected = (key: string) => {
  return key === downloadFormat.value.key;
};

watch(downloadFormat, (format) => {
  trackEvent(useGtag().gtag, "Change file format", { format: format.key });
});
</script>

<style lang="scss" scoped>
.download-button-container {
  @apply flex w-full;

  .download-button-main {
    @apply rounded-r-none pr-2;
  }
  .download-button-select {
    @apply relative rounded-l-none border-l border-blue-800 px-4 text-sm focus:z-10;
  }
}
</style>
