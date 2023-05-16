import { defineStore } from "pinia";
import { computed, nextTick, type Ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useStorage } from "@vueuse/core";

type ZkNetworkName = "goerli" | "goerli-beta" | "mainnet";
export type ZkNetworkOption = {
  name: ZkNetworkName;
  label: string;
};
export default defineStore("network", () => {
  const zkNetworkOptions = <ZkNetworkOption[]>[
    { name: "mainnet", label: "Mainnet" },
    { name: "goerli", label: "Goerli Testnet" },
    { name: "goerli-beta", label: "Goerli Beta Testnet" },
  ];
  const zkNetworkName = useStorage("network", "mainnet") as Ref<ZkNetworkName>;

  const queryNetwork = useRouteQuery("network");
  setTimeout(() => {
    // Need to wait until query param becomes available
    if (queryNetwork.value && zkNetworkOptions.find((e) => e.name === queryNetwork.value)) {
      zkNetworkName.value = queryNetwork.value as ZkNetworkName;
    }
  }, 0);

  const selectedNetwork = computed(() => {
    return zkNetworkOptions.find((e) => e.name === zkNetworkName.value) || zkNetworkOptions[0];
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
