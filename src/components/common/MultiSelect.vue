<template>
  <Multiselect v-model="selected" mode="tags" :close-on-select="false" :searchable="true" :options="options" />
</template>

<script lang="ts">
export type MultiSelectOption = { id: number; value: string; label: string; default: boolean };
</script>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import Multiselect from "@vueform/multiselect";

const props = defineProps({
  modelValue: {
    type: Object as PropType<MultiSelectOption>,
    default: () => ({}),
    required: false,
  },
  options: {
    type: Array as PropType<MultiSelectOption[]>,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: MultiSelectOption): void;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss">
.multiselect {
  @apply relative flex w-full cursor-pointer items-center justify-end rounded-md border-2 border-gray-300 bg-white text-base leading-snug outline-none;
  &.is-active {
    @apply border-indigo-500;
  }

  .multiselect-tags {
    @apply mt-1.5 flex flex-shrink flex-grow flex-wrap items-center pb-1 pl-2;
  }

  .multiselect-tag {
    @apply mr-1 mb-1 flex items-center rounded-md bg-indigo-600 py-1 pl-2 text-sm font-semibold leading-tight text-white;
  }

  .multiselect-tag-remove {
    @apply mx-0.5 flex items-center justify-center rounded-full p-1 text-white opacity-50 transition hover:bg-gray-100 hover:bg-opacity-20 hover:opacity-100;
    .multiselect-tag-remove-icon {
      @apply inline-block h-3 w-3 bg-current bg-center bg-no-repeat;
      mask-repeat: no-repeat;
      mask-position: center;
      mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
    }
  }

  .multiselect-tags-search-wrapper {
    @apply relative mx-1 mb-1 inline-block h-full flex-shrink flex-grow;
  }

  .multiselect-tags-search {
    @apply absolute inset-0 box-border w-full appearance-none border-0 p-0 font-sans text-base outline-none focus:ring-0;
  }

  .multiselect-tags-search-copy {
    @apply invisible inline-block h-px whitespace-pre-wrap;
  }

  .multiselect-placeholder {
    @apply pointer-events-none absolute left-0 top-0 flex h-full items-center bg-transparent pl-3.5 leading-snug text-gray-400;
  }

  .multiselect-caret {
    @apply pointer-events-none relative z-10 mr-2 box-content h-4 w-2.5 flex-shrink-0 flex-grow-0 transform bg-gray-400 bg-center bg-no-repeat py-px opacity-40 transition-transform sm:mr-3.5;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'/%3E%3C/svg%3E");

    &.is-open {
      @apply pointer-events-auto rotate-180;
    }
  }

  .multiselect-clear {
    @apply relative z-10 flex flex-shrink-0 flex-grow-0 pr-2 opacity-40 transition duration-300 hover:opacity-100 sm:pr-3.5;
  }

  .multiselect-clear-icon {
    @apply box-content inline-block h-4 w-2.5 bg-gray-400 bg-center bg-no-repeat py-px;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
  }

  .multiselect-dropdown {
    @apply absolute -left-px -right-px -bottom-1.5 z-50 flex max-h-60 translate-y-full transform flex-col overflow-y-scroll rounded-md border border-gray-300 bg-white;

    &.is-top {
      @apply top-px bottom-auto -translate-y-full flex-col-reverse rounded-b-none rounded-t;
    }

    &.is-hidden {
      @apply hidden;
    }
  }

  .multiselect-options {
    @apply m-0 flex list-none flex-col p-0;

    &.is-top {
      @apply flex-col-reverse;
    }
  }

  .multiselect-option {
    @apply box-border flex cursor-pointer items-center justify-start py-2 px-3 text-left text-base leading-snug;

    &.is-pointed {
      @apply bg-indigo-600 text-white;
    }

    &.is-selected {
      @apply bg-green-500 text-white;
    }

    &.is-disabled {
      @apply cursor-not-allowed text-gray-300;
    }

    &.is-selected.is-pointed {
      @apply bg-green-500 text-white opacity-90;
    }

    &.is-selected.is-disabled {
      @apply cursor-not-allowed bg-green-500 bg-opacity-50 text-green-100;
    }
  }

  .multiselect-no-options {
    @apply bg-white py-2 px-3 text-left text-gray-600;
  }

  .multiselect-no-results {
    @apply bg-white py-2 px-3 text-left text-gray-600;
  }

  .multiselect-fake-input {
    @apply absolute left-0 right-0 -bottom-px h-px w-full appearance-none border-0 bg-transparent p-0 text-transparent outline-none;
  }

  .multiselect-spacer {
    @apply box-content h-9 py-px;
  }
}
</style>
