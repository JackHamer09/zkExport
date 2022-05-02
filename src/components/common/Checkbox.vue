<template>
  <div class="flex items-start">
    <div class="flex h-5 items-center">
      <input v-model="inputted" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
    </div>
    <div class="ml-3 text-sm">
      <label class="font-medium text-gray-700">
        <slot />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

const inputted = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit("update:modelValue", value);
  },
});
</script>
