import { format } from "date-fns";
import { fieldNames, formatTokenAmount, formatDate } from "../helpers";

const formatTransferDirection = (address: string, to: string, from: string) => {
  address = address.toLowerCase();
  to = to.toLowerCase();
  from = from.toLowerCase();

  if (to === from && to === address) {
    return "self";
  } else if (to === address) {
    return "in";
  } else if (from === address) {
    return "out";
  }
  return "";
};

const formatTransferFromOrigin = (
  transferType: Api.Response.Transfer["type"],
  networkName: string,
  l1NetworkName: string
) => {
  return transferType === "deposit" ? l1NetworkName : networkName;
};
const formatTransferToOrigin = (
  transferType: Api.Response.Transfer["type"],
  networkName: string,
  l1NetworkName: string
) => {
  return transferType === "withdrawal" ? l1NetworkName : networkName;
};

export const getTransfersDownloadData = (
  transfers: Api.Response.Transfer[],
  config: { address: string; networkName: string; l1NetworkName: string }
) => {
  type Entry = Record<string, string | number>;
  const finalData: Entry[] = [];

  for (const item of transfers) {
    const entry: Entry = {};

    entry[fieldNames.date] = formatDate(item.timestamp);
    entry[fieldNames.amount] = formatTokenAmount(item.amount, item.token?.decimals);
    entry[fieldNames.tokenSymbol] = item.token?.symbol || "";
    entry[fieldNames.type] = item.type;
    entry[fieldNames.direction] = formatTransferDirection(config.address, item.to, item.from);
    entry[fieldNames.from] = item.from;
    entry[fieldNames.fromOrigin] = formatTransferFromOrigin(item.type, config.networkName, config.l1NetworkName);
    entry[fieldNames.to] = item.to;
    entry[fieldNames.toOrigin] = formatTransferToOrigin(item.type, config.networkName, config.l1NetworkName);
    entry[fieldNames.tokenL1Address] = item.token?.l1Address || "";
    entry[fieldNames.tokenL2Address] = item.token?.l2Address || item.tokenAddress;
    entry[fieldNames.txHash] = item.transactionHash || "";
    finalData.push(entry);
  }

  return finalData;
};

export const getTransfersAwakenDownloadData = (
  transfers: Api.Response.Transfer[],
  config: { address: string; networkName: string; l1NetworkName: string }
) => {
  type Entry = Record<string, string | number>;
  const finalData: Entry[] = [];

  for (const item of transfers) {
    const entry: Entry = {};

    const direction = formatTransferDirection(config.address, item.to, item.from);
    const fromOrigin = formatTransferFromOrigin(item.type, config.networkName, config.l1NetworkName);
    const toOrigin = formatTransferToOrigin(item.type, config.networkName, config.l1NetworkName);

    if (direction === "self") {
      continue;
    }

    entry.Date = format(new Date(item.timestamp), "M/d/yy H:mm");
    const tokenAmount = formatTokenAmount(item.amount, item.token?.decimals);
    const tokenSymbol = item.token?.symbol || "";

    entry["Received Quantity"] = "";
    entry["Received Currency"] = "";
    entry["Sent Quantity"] = "";
    entry["Sent Currency"] = "";
    if (direction === "in" && toOrigin === config.networkName) {
      entry["Received Quantity"] = tokenAmount;
      entry["Received Currency"] = tokenSymbol;
    } else if (direction === "out" && fromOrigin === config.networkName) {
      entry["Sent Quantity"] = tokenAmount;
      entry["Sent Currency"] = tokenSymbol;
    } else {
      continue;
    }
    entry["Fee Amount"] = "";
    entry["Fee Currency"] = "";
    entry.Notes = item.type;
    entry["Transaction Hash"] = item.transactionHash || "";

    finalData.push(entry);
  }

  return finalData;
};
