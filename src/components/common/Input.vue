<template>
  <input v-bind="$attrs" v-model="inputted" type="text" spellcheck="false" class="input" />
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<string | number | null>,
    default: null,
    required: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string | number | null): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string | number | null) => {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
.input {
  @apply block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 xs:text-base;
}
</style>
