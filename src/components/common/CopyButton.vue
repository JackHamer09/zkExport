<template>
  <Menu as="div" class="copy-button-container">
    <MenuButton class="copy-button" @click.prevent="copyValue">
      <slot>
        <DocumentDuplicateIcon class="copy-button-icon" aria-hidden="true" />
      </slot>
    </MenuButton>
    <Tooltip :position="tooltipPosition" :opened="isCopied">Copied!</Tooltip>
  </Menu>
</template>

<script lang="ts" setup>
import { type PropType, ref } from "vue";

import { Menu, MenuButton } from "@headlessui/vue";
import { DocumentDuplicateIcon } from "@heroicons/vue/outline/index.js";

import Tooltip, { type TooltipPosition } from "@/components/common/Tooltip.vue";

const props = defineProps({
  value: {
    type: [String, Number],
    default: "",
    required: true,
  },
  tooltipPosition: {
    type: String as PropType<TooltipPosition>,
    default: "top",
  },
});
const isCopied = ref(false);

function resetIsShowing() {
  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 1000);
}

function copyToClipboard(value: string) {
  const elem = document.createElement("textarea");
  elem.style.position = "absolute";
  elem.style.left = -99999999 + "px";
  elem.style.top = -99999999 + "px";
  elem.value = value;
  document.body.appendChild(elem);
  elem.select();
  elem.focus();
  document.execCommand("copy");
  document.body.removeChild(elem);
}

function copyValue() {
  copyToClipboard(props.value.toString());
  resetIsShowing();
}
</script>

<style lang="scss" scoped>
.copy-button-container {
  @apply relative h-6 w-6;

  .copy-button {
    @apply absolute -left-1 -top-1 rounded-md p-1 text-neutral-500 transition-colors hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500;

    .copy-button-icon {
      @apply inline-block h-5 w-5 rounded-full;
    }
  }
}
</style>
