export type Chain = {
  id: number;
  key: string;
  name: string;
  l1Name: string;
  apiUrl: string;
  // If set to true, the network will not be shown in the network selector
  hidden?: boolean;
};

const chains: Chain[] = [
  {
    id: 324,
    key: "mainnet",
    name: "zkSync Era Mainnet",
    l1Name: "Ethereum Mainnet",
    apiUrl: "https://block-explorer-api.mainnet.zksync.io",
  },
  {
    id: 280,
    key: "goerli",
    name: "zkSync Era Testnet",
    l1Name: "Ethereum Goerli Testnet",
    apiUrl: "https://block-explorer-api.testnets.zksync.dev",
  },
];

export default chains;
