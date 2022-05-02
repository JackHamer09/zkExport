<template>
  <Switch
    v-model="enabled"
    :class="enabled ? 'bg-indigo-600' : 'bg-gray-700'"
    class="relative flex h-[38px] w-[74px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  >
    <span
      aria-hidden="true"
      :class="enabled ? 'translate-x-9' : 'translate-x-0'"
      class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
    />
  </Switch>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Switch } from "@headlessui/vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
    required: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: boolean): void;
}>();

const enabled = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit("update:modelValue", value);
  },
});
</script>
