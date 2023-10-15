import { useStorage } from "@vueuse/core";
import chains from "@/data/chains";

export const useNetworkStore = defineStore("network", () => {
  const defaultChain = chains[0];
  const selectedStorageChain = useStorage<string>("selectedChain", defaultChain.key);
  const selectedChain = computed(() => {
    return chains.find((e) => e.key === selectedStorageChain.value) ?? defaultChain;
  });

  const changeChain = (chain: string) => {
    selectedStorageChain.value = chain;
  };

  return {
    selectedChain,
    changeChain,
  };
});
