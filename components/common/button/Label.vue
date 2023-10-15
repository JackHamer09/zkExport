<template>
  <component :is="as" type="button" class="common-label-button" :class="{ 'button-underlined': underline }">
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  underline: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.common-label-button {
  @apply rounded-full text-sm text-gray-500 transition hover:text-indigo-600;
  &:disabled {
    @apply cursor-not-allowed;
  }
  &.button-underlined {
    @apply underline underline-offset-2;
  }
}
</style>
