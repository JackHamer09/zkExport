import { useStorage } from "@vueuse/core";
import chains from "@/data/chains";

export const useNetworkStore = defineStore("network", () => {
  const defaultChain = chains[0];
  const selectedStorageChain = useStorage<string>("selectedChain", defaultChain.key);
  const selectedChain = computed(() => {
    return chains.find((e) => e.key === selectedStorageChain.value) ?? defaultChain;
  });

  const identifyNetworkByQueryParam = () => {
    const windowLocation = process.client ? window.location.search : "";
    const networkFromQueryParam = new URLSearchParams(windowLocation).get("network");
    if (networkFromQueryParam && chains.some((e) => e.key === networkFromQueryParam)) {
      selectedStorageChain.value = networkFromQueryParam;
    }
  };

  identifyNetworkByQueryParam();

  const changeChain = (chain: string) => {
    selectedStorageChain.value = chain;
  };

  return {
    selectedChain,
    changeChain,
  };
});
