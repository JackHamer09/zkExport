import { defineStore } from "pinia";
import { computed, type Ref } from "vue";
import { useStorage } from "@vueuse/core";

type ZkNetworkName = "rinkeby" | "rinkeby-beta" | "ropsten" | "ropsten-beta" | "mainnet";
export type ZkNetworkOption = {
  name: ZkNetworkName;
  label: string;
};
export default defineStore("network", () => {
  const zkNetworkOptions = <ZkNetworkOption[]>[
    { name: "mainnet", label: "Mainnet" },
    { name: "rinkeby", label: "Rinkeby Testnet" },
    { name: "ropsten", label: "Ropsten Testnet" },
    { name: "rinkeby-beta", label: "Rinkeby Beta Testnet" },
    { name: "ropsten-beta", label: "Ropsten Beta Testnet" },
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
      case "rinkeby":
        return "https://rinkeby-api.zksync.io/api/v0.2";
      case "rinkeby-beta":
        return "https://rinkeby-beta-api.zksync.io/api/v0.2";
      case "ropsten":
        return "https://ropsten-api.zksync.io/api/v0.2";
      case "ropsten-beta":
        return "https://ropsten-beta-api.zksync.io/api/v0.2";
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
