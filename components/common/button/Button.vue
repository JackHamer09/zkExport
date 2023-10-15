<template>
  <component
    :is="as"
    type="button"
    class="common-button"
    :class="[`variant-${variant}`, `size-${size}`, { loading }]"
    :disabled="loading"
    :aria-disabled="loading"
  >
    <component :is="icon" v-if="icon && iconPosition === 'left'" class="button-icon left" aria-hidden="true" />
    <slot />
    <CommonSpinner v-if="loading" class="button-spinner" aria-hidden="true" />
    <component :is="icon" v-if="icon && iconPosition === 'right'" class="button-icon right" aria-hidden="true" />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  icon: {
    type: [String, Function, Object] as PropType<string | Component>,
  },
  variant: {
    type: String as PropType<"primary" | "warning" | "success" | "error">,
    default: "primary",
  },
  iconPosition: {
    type: String as PropType<"left" | "right">,
    default: "left",
  },
  size: {
    type: String as PropType<"md" | "sm">,
    default: "md",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.common-button {
  @apply flex h-12 w-full items-center justify-center rounded-3xl px-7 text-center text-sm font-medium leading-tight transition;
  &.size-md {
    @apply h-12;
  }
  &.size-sm {
    @apply h-10;
  }

  &.variant-primary {
    @apply bg-blue-700 text-white hover:bg-blue-800;
  }
  &.variant-success {
    @apply bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20 hover:bg-green-100;
  }
  &.variant-warning {
    @apply bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20 hover:bg-yellow-100;
  }
  &.variant-error {
    @apply bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20 hover:bg-red-100;
  }

  .button-icon {
    @apply h-5 w-5;
    &.left {
      @apply -ml-2 mr-2;
    }
    &.right {
      @apply -mr-2 ml-2;
    }
  }
  .button-spinner {
    @apply -mr-7 ml-2 h-5 w-5;
  }
}
</style>
