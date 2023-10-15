import { useStorage } from "@vueuse/core";

export const fileFormatOptions = [
  { key: "csv", name: "CSV" },
  { key: "xlsx", name: "XLSX" },
  { key: "xml", name: "XML" },
  { key: "ods", name: "ODS" },
  { key: "html", name: "HTML" },
  { key: "txt", name: "TXT" },
  { key: "json", name: "JSON" },
];

export const usePreferencesStore = defineStore("preferences", () => {
  const selectedDownloadFormat = useStorage("selectedDownloadFormat", fileFormatOptions[0].key);
  const downloadFormat = computed(
    () => fileFormatOptions.find((e) => e.key === selectedDownloadFormat.value) || fileFormatOptions[0]
  );
  const setDownloadFormat = (key: string) => {
    selectedDownloadFormat.value = key;
  };

  return {
    downloadFormat,
    setDownloadFormat,
  };
});
