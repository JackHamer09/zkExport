import { defineStore } from "pinia";
import { computed, type Ref } from "vue";
import { useStorage } from "@vueuse/core";

type ZkNetworkName = "goerli" | "goerli-beta" | "sepolia" | "mainnet";
export type ZkNetworkOption = {
  name: ZkNetworkName;
  label: string;
};
export default defineStore("network", () => {
  const zkNetworkOptions = <ZkNetworkOption[]>[
    { name: "mainnet", label: "Mainnet" },
    { name: "goerli", label: "Goerli Testnet" },
    { name: "sepolia", label: "Sepolia Testnet" },
    { name: "goerli-beta", label: "Goerli Beta Testnet" },
  ];
  const zkNetworkName = useStorage("network", "mainnet") as Ref<ZkNetworkName>;

  const selectedNetwork = computed(() => {
    return zkNetworkOptions.find((e) => e.name === zkNetworkName.value)!;
  });

  const isMainnet = computed(() => {
    return selectedNetwork.value.name === "mainnet";
  });

  const apiDomain = computed(() => {
    switch (selectedNetwork.value.name) {
      case "goerli":
        return "https://goerli-api.zksync.io/api/v0.2";
      case "goerli-beta":
        return "https://goerli-beta-api.zksync.dev/api/v0.2";
      case "sepolia":
        return "https://sepolia-api.zksync.io/api/v0.2";
      case "mainnet":
      default:
        return "https://api.zksync.io/api/v0.2";
    }
  });

  function setNetwork(networkName: ZkNetworkName) {
    zkNetworkName.value = networkName;
  }

  return {
    zkNetworkOptions,
    selectedNetwork,
    isMainnet,
    apiDomain,
    setNetwork,
  };
});
