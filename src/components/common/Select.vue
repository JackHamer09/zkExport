<template>
  <Listbox class="relative" as="div" v-model="selected">
    <ListboxButton
      class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-2 pr-5 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 xs:text-base sm:pl-3 sm:pr-10"
    >
      <span class="flex items-center">
        <span class="block truncate">{{ selected.name }}</span>
      </span>
      <span class="pointer-events-none absolute inset-y-0 right-0 ml-1 flex items-center pr-0.5 sm:ml-3 sm:pr-2">
        <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </ListboxButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <ListboxOptions
        class="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:max-h-56 md:text-base"
      >
        <ListboxOption
          as="template"
          v-for="option in options"
          :key="option.id"
          :value="option"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
              'relative cursor-default select-none py-1 pl-3 pr-7 transition-colors duration-100 md:py-2 md:pr-9',
            ]"
          >
            <div class="flex items-center">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                {{ option.name }}
              </span>
            </div>

            <span
              v-if="selected"
              :class="[
                active ? 'text-white' : 'text-indigo-600',
                'absolute inset-y-0 right-0 flex items-center pr-2 transition-colors duration-100 md:pr-4',
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script lang="ts">
export type SelectOption = { id: number; key: string; name: string };
</script>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

const props = defineProps({
  modelValue: {
    type: Object as PropType<SelectOption>,
    default: () => ({}),
    required: false,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", option: SelectOption): void;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
