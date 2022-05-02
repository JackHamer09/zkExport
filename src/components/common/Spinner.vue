<template>
  <div class="spinner-container">
    <div class="spinner" :class="[size, color]"></div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg">,
    default: "sm",
  },
  color: {
    type: String as PropType<"light" | "dark" | "indigo">,
    default: "light",
  },
});
</script>

<style lang="scss" scoped>
.spinner-container {
  @apply inline-flex;
  .spinner {
    @apply animate-spin rounded-full border-transparent;
    &.light {
      @apply border-l-neutral-200;
    }
    &.dark {
      @apply border-l-neutral-600;
    }
    &.indigo {
      @apply border-l-indigo-600;
    }
    &.xs {
      @apply h-4 w-4 border-2;
    }
    &.sm {
      @apply h-6 w-6 border-4;
    }
    &.md {
      @apply h-10 w-10 border-4;
    }
    &.lg {
      @apply h-16 w-16 border-8;
    }
  }
}
</style>
