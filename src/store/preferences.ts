import { defineStore } from "pinia";
import { ref } from "vue";
import useAccountInfo from "./accountInfo";
import useAccountBalances from "./accountBalances";
import useAccountNFTs from "./accountNFTs";
import useAccountTransactions from "./accountTransactions";
import useBlockInfo from "./blockInfo";
import useBlockTransactions from "./blockTransactions";

export default defineStore("preferences", () => {
  const accountInfo = useAccountInfo();
  const accountBalances = useAccountBalances();
  const accountNFTs = useAccountNFTs();
  const accountTransactions = useAccountTransactions();
  const blockInfo = useBlockInfo();
  const blockTransactions = useBlockTransactions();

  const fileFormatOptions = [
    { id: 1, key: "csv", name: "CSV" },
    { id: 2, key: "xlsx", name: "XLSX" },
    { id: 3, key: "xml", name: "XML" },
    { id: 4, key: "ods", name: "ODS" },
    { id: 5, key: "html", name: "HTML" },
    { id: 6, key: "txt", name: "TXT" },
    { id: 7, key: "json", name: "JSON" },
  ];

  const fileFormat = ref(fileFormatOptions[0]);

  function setAddressEverywhere(address?: string | null) {
    if (address) {
      accountInfo.values.address = address;
      accountBalances.values.address = address;
      accountNFTs.values.address = address;
      accountTransactions.values.address = address;
    }
  }
  function setBlockEverywhere(blockID?: string | null) {
    if (blockID) {
      blockInfo.values.blockID = blockID;
      blockTransactions.values.blockID = blockID;
    }
  }
  return {
    fileFormat,
    fileFormatOptions,
    setAddressEverywhere,
    setBlockEverywhere,
  };
});
