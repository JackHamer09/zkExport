<template>
  <div class="download-as-select flex items-center justify-between gap-5">
    <span class="text-left leading-tight text-neutral-600 sm:text-base">Download file as</span>
    <Select class="w-28" v-model="fileFormat" :options="preferences.fileFormatOptions" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import Select from "@/components/common/Select.vue";
import usePreferences from "@/store/preferences";

const preferences = usePreferences();
const { fileFormat } = storeToRefs(preferences);
</script>
