import { formatUnits } from "@ethersproject/units";

export const fieldNames = {
  date: "Date",
  txHash: "Transaction hash",
  type: "Type",
  direction: "Direction",
  from: "From",
  to: "To",
  fromOrigin: "From origin",
  toOrigin: "To origin",
  amount: "Amount",
  tokenL1Address: "Token L1 address",
  tokenL2Address: "Token L2 address",
  tokenSymbol: "Token symbol",
  tokenName: "Token name",
  tokenType: "Token type",
} as const;

export const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

export const formatTokenAmount = (amount: string | null, decimals?: number) => {
  if (!amount || !decimals) {
    return "";
  }
  const result = formatUnits(amount, decimals).toString();
  if (result.endsWith(".0")) {
    return result.slice(0, -2);
  }
  return result;
};
