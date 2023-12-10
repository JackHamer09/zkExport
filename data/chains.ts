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
    name: "zkSync Mainnet",
    l1Name: "Ethereum Mainnet",
    apiUrl: "https://block-explorer-api.mainnet.zksync.io",
  },
  {
    id: 300,
    key: "sepolia",
    name: "zkSync Sepolia Testnet",
    l1Name: "Ethereum Sepolia Testnet",
    apiUrl: "https://block-explorer-api.sepolia.zksync.dev",
  },
  {
    id: 280,
    key: "goerli",
    name: "zkSync Goerli Testnet",
    l1Name: "Ethereum Goerli Testnet",
    apiUrl: "https://block-explorer-api.testnets.zksync.dev",
  },
];

export default chains;
