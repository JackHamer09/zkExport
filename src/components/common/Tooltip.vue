<template>
  <transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div class="tooltip" v-if="opened" :class="position">
      <div class="tooltip-inner">
        <div class="tooltip-content">
          <div class="tooltip-arrow"></div>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
export type TooltipPosition = "top" | "left" | "right";

defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String as PropType<TooltipPosition>,
    default: "top",
  },
});
</script>

<style lang="scss" scoped>
.tooltip {
  @apply pointer-events-none absolute left-0 top-0 focus:outline-none;
  &.top {
    @apply w-full;

    .tooltip-inner {
      @apply inset-x-0 bottom-full mb-2;

      .tooltip-content .tooltip-arrow {
        @apply top-full left-1/2 -ml-[3px] border-t-neutral-400;
      }
    }
  }
  &.left {
    @apply h-full;
    .tooltip-inner {
      @apply inset-y-0 right-full mr-2;

      .tooltip-content .tooltip-arrow {
        @apply left-full top-1/2 -mt-[3px] border-l-neutral-400;
      }
    }
  }
  &.right {
    @apply left-full h-full;
    .tooltip-inner {
      @apply inset-y-0 left-full ml-2;

      .tooltip-content .tooltip-arrow {
        @apply right-full top-1/2 -mt-[3px] rotate-180 border-l-neutral-400;
      }
    }
  }

  .tooltip-inner {
    @apply absolute flex items-center justify-center;

    .tooltip-content {
      @apply whitespace-nowrap rounded-md bg-neutral-400 py-1 px-2 text-sm leading-4 tracking-wide text-white;

      .tooltip-arrow {
        @apply absolute border-4 border-transparent;
      }
    }
  }
}
</style>
