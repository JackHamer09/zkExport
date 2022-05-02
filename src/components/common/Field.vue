<template>
  <div class="field-item">
    <dt class="field-label">{{ field.name }}</dt>
    <dd class="field-component-container">
      <Input v-if="field.component === 'input'" v-model="inputted" v-bind="field" />
      <Select v-else-if="field.component === 'select'" v-model="inputted" v-bind="(field as any)" />
      <MultiSelect v-else-if="field.component === 'multiselect'" v-model="inputted" v-bind="(field as any)" />
      <Toggle v-else-if="field.component === 'toggle'" v-model="inputted" v-bind="field" />
      <DatePicker
        v-else-if="field.component === 'datetime'"
        color="indigo"
        mode="dateTime"
        is24hr
        v-model="inputted"
        v-bind="field"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <Input :model-value="inputValue" :placeholder="field.placeholder" v-on="inputEvents" />
        </template>
      </DatePicker>
    </dd>
  </div>
</template>

<script lang="ts">
import type { SelectOption } from "@/components/common/Select.vue";
import type { MultiSelectOption } from "@/components/common/MultiSelect.vue";

export interface FormField<K> {
  component: "input" | "select" | "toggle" | "multiselect" | "datetime";
  prop: K;
  name: string;
  validation?: string;
  placeholder?: string;
  options?: SelectOption[] | MultiSelectOption[];
  minDate?: Date;
  maxDate?: Date;
}
</script>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Values } from "@/store/accountTransactions";
import { DatePicker } from "v-calendar";
import Input from "@/components/common/Input.vue";
import Select from "@/components/common/Select.vue";
import MultiSelect from "@/components/common/MultiSelect.vue";
import Toggle from "@/components/common/Toggle.vue";

type ModelValue = string | number | boolean | Record<string, unknown> | Date | null;
const props = defineProps({
  field: {
    type: Object as PropType<FormField<Values>>,
    default: () => ({}),
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, Object] as PropType<ModelValue>,
    default: null,
    required: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: ModelValue): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit("update:modelValue", value);
  },
});
</script>

<style lang="scss" scoped>
.field-item {
  @apply bg-white py-3 sm:grid sm:grid-cols-3 sm:gap-4;

  .field-label {
    @apply text-sm font-medium leading-6 text-gray-500 sm:leading-10;
  }
  .field-component-container {
    @apply mt-1 sm:col-span-2 sm:mt-0;
  }
}
</style>
