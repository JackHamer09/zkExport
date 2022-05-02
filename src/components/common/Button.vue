<template>
  <button v-bind="$attrs" :class="[`size-${size}`, `color-${color}`, `outline-${outline}`]" class="button">
    <transition name="fade">
      <Spinner class="spinner" size="xs" v-if="loading" />
    </transition>
    <div class="button-slot">
      <slot />
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import Spinner from "./Spinner.vue";

defineProps({
  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg">,
    default: "sm",
    required: false,
  },
  color: {
    type: String as PropType<"indigo" | "green" | "red" | "yellow" | "gray">,
    default: "indigo",
    required: false,
  },
  outline: {
    type: Boolean,
    default: false,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.button {
  @apply flex items-center justify-center rounded-md border border-transparent text-center font-medium text-white shadow-sm transition-colors;

  &[disabled] {
    @apply cursor-not-allowed;
    &.outline {
      &-false {
        &.color {
          &-indigo {
            @apply bg-indigo-400;
          }
          &-green {
            @apply bg-green-400;
          }
          &-red {
            @apply bg-red-400;
          }
          &-yellow {
            @apply bg-yellow-400;
          }
          &-gray {
            @apply bg-gray-400;
          }
        }
      }
      &-true {
        &.color {
          &-indigo {
            @apply border-indigo-300 text-indigo-300;
          }
          &-green {
            @apply border-green-300 text-green-300;
          }
          &-red {
            @apply border-red-300 text-red-300;
          }
          &-yellow {
            @apply border-yellow-300 text-yellow-300;
          }
          &-gray {
            @apply border-gray-300 text-gray-300;
          }
        }
      }
    }
  }
  &:not([disabled]) {
    @apply cursor-pointer focus:outline-none;
    &.outline {
      &-false {
        &.color {
          &-indigo {
            @apply bg-indigo-600 hover:bg-indigo-700;
          }
          &-green {
            @apply bg-green-500 hover:bg-green-600;
          }
          &-red {
            @apply bg-red-500 hover:bg-red-600;
          }
          &-yellow {
            @apply bg-yellow-500 hover:bg-yellow-600;
          }
          &-gray {
            @apply bg-gray-500 hover:bg-gray-600;
          }
        }
      }
      &-true {
        &.color {
          &-indigo {
            @apply border-indigo-600 text-indigo-600 hover:border-indigo-800 hover:text-indigo-800;
          }
          &-green {
            @apply border-green-500 text-green-600 hover:border-green-600 hover:text-green-700;
          }
          &-red {
            @apply border-red-500 text-red-600 hover:border-red-600 hover:text-red-700;
          }
          &-yellow {
            @apply border-yellow-500 text-yellow-600 hover:border-yellow-600 hover:text-yellow-700;
          }
          &-gray {
            @apply border-gray-400 text-gray-500 hover:border-gray-600 hover:text-gray-700;
          }
        }
      }
    }
  }
  &.size {
    &-xs {
      @apply py-1 px-4 text-sm leading-tight;
    }
    &-sm {
      @apply py-2 px-4 text-sm;
    }
    &-md {
      @apply py-2 px-4 text-base;
    }
    &-lg {
      @apply py-3 px-8 text-xl font-semibold sm:text-3xl;
    }
  }

  .spinner-container {
    @apply mr-2.5 -ml-1;
  }
  .button-slot {
    @apply flex items-center justify-center;
  }
}
</style>
