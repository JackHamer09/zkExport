<template>
  <div class="download-as-select flex items-center justify-between gap-5">
    <span class="text-left leading-tight text-neutral-600 sm:text-base">Download file as</span>
    <Select class="w-28" v-model="fileFormat" :options="preferences.fileFormatOptions" />
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { logEvent } from "@/utils/logger";
import Select from "@/components/common/Select.vue";
import usePreferences from "@/store/preferences";

const preferences = usePreferences();
const { fileFormat } = storeToRefs(preferences);

watch(fileFormat, (format) => {
  logEvent("Change file format", format.key);
});
</script>
