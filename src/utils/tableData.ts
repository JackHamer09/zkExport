import { isNFT } from "zksync/build/utils";
import type { ApiAccountInfo, ApiBlockInfo, ApiTransaction } from "zksync/build/types";
import { formatDate } from "@/utils/helpers";
import {
  fieldsNames,
  type TransactionFieldNameKeys,
  balancesFieldKeys,
  type BalancesFieldNameKeys,
  transactionFieldKeys,
  type NFTsFieldNameKeys,
  nftsFieldKeys,
  type AccountInfoNameKeys,
  accountInfoKeys,
  type BlockInfoNameKeys,
  blockInfoKeys,
} from "@/utils/fields";
import useTokens from "@/store/tokens";

export function getTransactionsTableData(
  txList: ApiTransaction[],
  settings: {
    dateSort: "descending" | "ascending";
    skipFailed: boolean;
    removeEmptyColumns: boolean;
    fields: TransactionFieldNameKeys[];
  }
) {
  const tokens = useTokens();
  const data: Record<string, unknown>[] = [];
  const sortedTxs = txList.sort(
    (a, b) =>
      new Date((settings.dateSort === "descending" ? b : a).createdAt || 0).getTime() -
      new Date((settings.dateSort === "descending" ? a : b).createdAt || 0).getTime()
  );
  const getSwapOrderLabelWithNumber = (number: number, label: string) =>
    `Swap Order ${number} ${label.split("Swap Order ")[1]}`;
  settings.fields.sort((a, b) => transactionFieldKeys.indexOf(a) - transactionFieldKeys.indexOf(b));
  /* Add required fields */
  for (const tx of sortedTxs as Record<string, any>[]) {
    const isNFTOperation = tx.op.type.includes("NFT") === true || (tx.op.token && isNFT(tx.op.token) === true);
    let from = tx.op.from;
    let to = tx.op.to || tx.op.recipient;
    if (tx.op.type === "MintNFT") {
      from = tx.op.creatorAddress;
    } else if (tx.op.type === "ChangePubKey" || tx.op.type === "Close") {
      from = tx.op.account;
      to = tx.op.account;
    } else if (tx.op.type === "ForcedExit") {
      to = tx.op.target;
    }
    const tokenIDorSymbol = typeof tx.op.token === "number" ? tx.op.token : tx.op.tokenId;
    const isTokenNFT = isNFT(tokenIDorSymbol);
    const feeToken = typeof tx.op.feeToken === "number" ? tx.op.feeToken : !isTokenNFT ? tokenIDorSymbol : undefined;
    const feeAmount = !tx.op.fee ? "0" : tokens.parseBigNumberish(tx.op.fee, feeToken);
    let swapOrder1: any = undefined;
    let swapOrder2: any = undefined;
    if (tx.op.orders) {
      const order1 = tx.op.orders[0];
      const order2 = tx.op.orders[1];
      const order1Token = order1.tokenSell;
      const order2Token = order2.tokenSell;
      const isOrder1TokenNFT = isNFT(order1Token);
      const isOrder2TokenNFT = isNFT(order2Token);
      from = order1.recipient;
      to = order2.recipient;
      swapOrder1 = {
        accountId: order1.accountId,
        address: order1.recipient,
        nonce: order1.nonce,
        tokenID: isOrder1TokenNFT ? order1Token : tokens.getTokenBySymbolOrID(order1Token)?.id,
        tokenSymbol: isOrder1TokenNFT ? `NFT-${order1Token}` : tokens.getTokenBySymbolOrID(order1Token)?.symbol,
        amount: isOrder1TokenNFT ? 1 : tokens.parseBigNumberish(order1.amount, order1Token),
        amountRaw: isOrder1TokenNFT ? 1 : order1.amount,
        pubKey: order1.signature?.pubKey,
        signature: order1.signature?.signature,
        swapOrderETHSignatureType: order1.ethSignature?.type,
        swapOrderETHSignature: order1.ethSignature?.signature,
        validFrom: order1.validFrom,
        validUntil: order1.validUntil,
      };
      swapOrder2 = {
        accountId: order2.accountId,
        address: order2.recipient,
        nonce: order2.nonce,
        tokenID: isOrder2TokenNFT ? order2Token : tokens.getTokenBySymbolOrID(order2Token)?.id,
        tokenSymbol: isOrder2TokenNFT ? `NFT-${order2Token}` : tokens.getTokenBySymbolOrID(order2Token)?.symbol,
        amount: isOrder2TokenNFT ? 1 : tokens.parseBigNumberish(order2.amount, order2Token),
        amountRaw: isOrder2TokenNFT ? 1 : order2.amount,
        pubKey: order2.signature?.pubKey,
        signature: order2.signature?.signature,
        swapOrderETHSignatureType: order2.ethSignature?.type,
        swapOrderETHSignature: order2.ethSignature?.signature,
        validFrom: order2.validFrom,
        validUntil: order2.validUntil,
      };
    }
    const txObj: Record<string, unknown> = {};
    for (const field of settings.fields) {
      switch (field) {
        case "createdAt":
          txObj[fieldsNames[field]] = tx.createdAt ? formatDate(tx.createdAt) : undefined;
          break;
        case "txHash":
          txObj[fieldsNames[field]] = tx.op.type === "Deposit" ? tx.op.ethHash : tx.txHash;
          break;
        case "ethTxHash":
          txObj[fieldsNames[field]] = tx.op.type === "Deposit" ? tx.txHash : tx.op.ethHash;
          break;
        case "status":
          txObj[fieldsNames[field]] = tx.status;
          break;
        case "type":
          txObj[fieldsNames[field]] = tx.op.type;
          break;
        case "failReason":
          if (!settings.skipFailed) {
            txObj[fieldsNames[field]] = tx.failReason;
          }
          break;
        case "isNFTOperation":
          txObj[fieldsNames[field]] = isNFTOperation ? "NFT Operation" : undefined;
          break;
        case "accountID":
          txObj[fieldsNames[field]] = tx.op.accountId;
          break;
        case "accountNonce":
          txObj[fieldsNames[field]] = tx.op.nonce;
          break;
        case "batchID":
          txObj[fieldsNames[field]] = tx.batchId;
          break;
        case "blockNumber":
          txObj[fieldsNames[field]] = tx.blockNumber;
          break;
        case "blockIndex":
          txObj[fieldsNames[field]] = tx.blockIndex;
          break;
        case "from":
          txObj[fieldsNames[field]] = from;
          break;
        case "to":
          txObj[fieldsNames[field]] = to;
          break;
        case "tokenID":
          txObj[fieldsNames[field]] = isTokenNFT ? tokenIDorSymbol : tokens.getTokenBySymbolOrID(tokenIDorSymbol)?.id;
          break;
        case "tokenSymbol":
          txObj[fieldsNames[field]] = isTokenNFT
            ? `NFT-${tokenIDorSymbol}`
            : tokens.getTokenBySymbolOrID(tokenIDorSymbol)?.symbol;
          break;
        case "amount":
          txObj[fieldsNames[field]] =
            tx.op.type === "MintNFT" ? 1 : tokens.parseBigNumberish(tx.op.amount, tokenIDorSymbol);
          break;
        case "amountRaw":
          txObj[fieldsNames[field]] = isTokenNFT || tx.op.type === "MintNFT" ? 1 : tx.op.amount;
          break;
        case "feeTokenID":
          txObj[fieldsNames[field]] = tokens.getTokenBySymbolOrID(feeToken)?.id;
          break;
        case "feeTokenSymbol":
          txObj[fieldsNames[field]] = feeAmount !== "0" ? tokens.getTokenBySymbolOrID(feeToken)?.symbol : undefined;
          break;
        case "feeAmount":
          txObj[fieldsNames[field]] = feeAmount;
          break;
        case "feeAmountRaw":
          txObj[fieldsNames[field]] = !tx.op.fee ? "0" : tx.op.fee;
          break;
        case "contentHash":
          txObj[fieldsNames[field]] = tx.op.contentHash;
          break;
        case "creatorAddress":
          txObj[fieldsNames[field]] = tx.op.creatorAddress;
          break;
        case "creatorID":
          txObj[fieldsNames[field]] = tx.op.creatorId;
          break;
        case "swapOrderAccountID":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.accountId;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.accountId;
          break;
        case "swapOrderAccountAddress":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.address;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.address;
          break;
        case "swapOrderAccountNonce":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.nonce;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.nonce;
          break;
        case "swapOrderTokenID":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.tokenID;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.tokenID;
          break;
        case "swapOrderTokenSymbol":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.tokenSymbol;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.tokenSymbol;
          break;
        case "swapOrderAmount":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.amount;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.amount;
          break;
        case "swapOrderAmountsPretty":
          txObj[fieldsNames[field]] =
            swapOrder1 && swapOrder2
              ? `${swapOrder1?.amount} ${swapOrder1?.tokenSymbol} → ${swapOrder2?.amount} ${swapOrder2?.tokenSymbol}`
              : undefined;
          break;
        case "swapOrderAmountRaw":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.amountRaw;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.amountRaw;
          break;
        case "swapOrderPubKey":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.pubKey;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.pubKey;
          break;
        case "swapOrderSignature":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.signature;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.signature;
          break;
        case "swapOrderETHSignatureType":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.swapOrderETHSignatureType;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.swapOrderETHSignatureType;
          break;
        case "swapOrderETHSignature":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.swapOrderETHSignature;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.swapOrderETHSignature;
          break;
        case "swapOrderValidFrom":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.validFrom;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.validFrom;
          break;
        case "swapOrderValidUntil":
          txObj[getSwapOrderLabelWithNumber(1, fieldsNames[field])] = swapOrder1?.validUntil;
          txObj[getSwapOrderLabelWithNumber(2, fieldsNames[field])] = swapOrder2?.validUntil;
          break;
        case "swapSubmitterAccountID":
          txObj[fieldsNames[field]] = tx.op.submitterId;
          break;
        case "swapSubmitterAccountAddress":
          txObj[fieldsNames[field]] = tx.op.submitterAddress;
          break;
        case "newPkHash":
          txObj[fieldsNames[field]] = tx.op.newPkHash;
          break;
        case "pubKey":
          txObj[fieldsNames[field]] = tx.op.signature?.pubKey;
          break;
        case "signature":
          txObj[fieldsNames[field]] = tx.op.signature?.signature;
          break;
      }
    }
    data.push(txObj);
  }
  /* Remove empty columns */
  if (settings.removeEmptyColumns) {
    const objKeyToFoundNotEmpty: Map<string, number> = new Map();
    for (const item of data) {
      for (const prop in item) {
        if (item[prop]) {
          objKeyToFoundNotEmpty.set(prop, (objKeyToFoundNotEmpty.get(prop) || 0) + 1);
        }
      }
    }
    for (const item of data) {
      for (const prop in item) {
        if (!objKeyToFoundNotEmpty.has(prop) || objKeyToFoundNotEmpty.get(prop) === 0) {
          delete item[prop];
        }
      }
    }
  }
  return data;
}

export function getBalancesTableData(
  balances: ApiAccountInfo["balances"],
  settings: {
    includeEmptyBalances: boolean;
    fields: BalancesFieldNameKeys[];
  }
) {
  const tokens = useTokens();
  const data = [];
  settings.fields.sort((a, b) => balancesFieldKeys.indexOf(a) - balancesFieldKeys.indexOf(b));
  for (const token of tokens.tokens) {
    const tokenBalance = balances[token.symbol]?.toString() ?? "0";
    if (!settings.includeEmptyBalances && tokenBalance === "0") {
      continue;
    }
    const row: Record<string, unknown> = {};
    for (const field of settings.fields) {
      switch (field) {
        case "tokenID":
          row[fieldsNames[field]] = token.id;
          break;
        case "tokenSymbol":
          row[fieldsNames[field]] = token.symbol;
          break;
        case "amount":
          row[fieldsNames[field]] = tokens.parseBigNumberish(tokenBalance, token.id);
          break;
        case "amountRaw":
          row[fieldsNames[field]] = tokenBalance;
          break;
      }
    }
    data.push(row);
  }
  return data;
}

export function getNFTsTableData(
  nfts: ApiAccountInfo["nfts"],
  settings: {
    fields: NFTsFieldNameKeys[];
  }
) {
  const data = [];
  settings.fields.sort((a, b) => nftsFieldKeys.indexOf(a) - nftsFieldKeys.indexOf(b));
  for (const nftID in nfts) {
    const nft = nfts[nftID];
    const row: Record<string, unknown> = {};
    for (const field of settings.fields) {
      switch (field) {
        case "tokenID":
          row[fieldsNames[field]] = nft.id;
          break;
        case "tokenSymbol":
          row[fieldsNames[field]] = `NFT-${nft.id}`;
          break;
        case "contentHash":
          row[fieldsNames[field]] = nft.contentHash;
          break;
        case "creatorID":
          row[fieldsNames[field]] = nft.creatorId;
          break;
        case "creatorAddress":
          row[fieldsNames[field]] = nft.creatorAddress;
          break;
      }
    }
    data.push(row);
  }
  return data;
}

export function getAccountInfoTableData(
  account: ApiAccountInfo,
  settings: {
    fields: AccountInfoNameKeys[];
  }
) {
  settings.fields.sort((a, b) => accountInfoKeys.indexOf(a) - accountInfoKeys.indexOf(b));
  const row: Record<string, unknown> = {};
  for (const field of settings.fields) {
    switch (field) {
      case "accountID":
        row[fieldsNames[field]] = account.accountId;
        break;
      case "accountAddress":
        row[fieldsNames[field]] = account.address;
        break;
      case "accountType":
        row[fieldsNames[field]] = account.accountType;
        break;
      case "accountNonce":
        row[fieldsNames[field]] = account.nonce;
        break;
      case "accountLastUpdateInBlock":
        row[fieldsNames[field]] = account.lastUpdateInBlock;
        break;
      case "pubKey":
        row[fieldsNames[field]] = account.pubKeyHash;
        break;
    }
  }
  return [row];
}

export function getBlockInfoTableData(
  block: ApiBlockInfo,
  settings: {
    fields: BlockInfoNameKeys[];
  }
) {
  settings.fields.sort((a, b) => blockInfoKeys.indexOf(a) - blockInfoKeys.indexOf(b));
  const row: Record<string, unknown> = {};
  for (const field of settings.fields) {
    switch (field) {
      case "blockNumber":
        row[fieldsNames[field]] = block.blockNumber;
        break;
      case "blockStatus":
        row[fieldsNames[field]] = block.status;
        break;
      case "blockSize":
        row[fieldsNames[field]] = block.blockSize;
        break;
      case "commitTxHash":
        row[fieldsNames[field]] = block.commitTxHash;
        break;
      case "committedAt":
        row[fieldsNames[field]] = block.committedAt ? formatDate(block.committedAt) : undefined;
        break;
      case "verifyTxHash":
        row[fieldsNames[field]] = block.verifyTxHash;
        break;
      case "finalizedAt":
        row[fieldsNames[field]] = block.finalizedAt ? formatDate(block.finalizedAt) : undefined;
        break;
      case "newStateRoot":
        row[fieldsNames[field]] = block.newStateRoot;
        break;
    }
  }
  return [row];
}
