<template>
  <div class="alert rounded-md py-2 px-4" :class="color" role="alert">
    <p class="break-words text-sm first-letter:capitalize">
      <slot />
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  color: {
    type: String as PropType<"error" | "warning" | "success">,
    default: "error",
  },
});
</script>

<style lang="scss" scoped>
.alert {
  &.error {
    @apply bg-red-100 text-red-700;
  }
  &.warning {
    @apply bg-yellow-100 text-yellow-700;
  }
  &.success {
    @apply bg-green-50 text-green-700;
  }
}
</style>
