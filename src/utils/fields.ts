export type TransactionFieldNameKeys =
  | "createdAt"
  | "txHash"
  | "ethTxHash"
  | "status"
  | "type"
  | "failReason"
  | "isNFTOperation"
  | "accountID"
  | "accountAddress"
  | "accountNonce"
  | "accountType"
  | "accountLastUpdateInBlock"
  | "batchID"
  | "blockNumber"
  | "blockStatus"
  | "blockSize"
  | "blockIndex"
  | "commitTxHash"
  | "committedAt"
  | "verifyTxHash"
  | "finalizedAt"
  | "newStateRoot"
  | "from"
  | "to"
  | "tokenID"
  | "tokenSymbol"
  | "amount"
  | "amountRaw"
  | "feeTokenID"
  | "feeTokenSymbol"
  | "feeAmount"
  | "feeAmountRaw"
  | "contentHash"
  | "creatorAddress"
  | "creatorID"
  | "swapOrderAccountID"
  | "swapOrderAccountAddress"
  | "swapOrderAccountNonce"
  | "swapOrderTokenID"
  | "swapOrderTokenSymbol"
  | "swapOrderAmount"
  | "swapOrderAmountsPretty"
  | "swapOrderAmountRaw"
  | "swapOrderPubKey"
  | "swapOrderSignature"
  | "swapOrderETHSignatureType"
  | "swapOrderETHSignature"
  | "swapOrderValidFrom"
  | "swapOrderValidUntil"
  | "swapSubmitterAccountID"
  | "swapSubmitterAccountAddress"
  | "newPkHash"
  | "pubKey"
  | "signature";

export const transactionFieldKeys: TransactionFieldNameKeys[] = [
  "createdAt",
  "txHash",
  "ethTxHash",
  "status",
  "type",
  "failReason",
  "isNFTOperation",
  "accountID",
  "accountNonce",
  "batchID",
  "blockNumber",
  "blockIndex",
  "from",
  "to",
  "tokenID",
  "tokenSymbol",
  "amount",
  "amountRaw",
  "feeTokenID",
  "feeTokenSymbol",
  "feeAmount",
  "feeAmountRaw",
  "contentHash",
  "creatorAddress",
  "creatorID",
  "swapOrderAccountID",
  "swapOrderAccountAddress",
  "swapOrderAccountNonce",
  "swapOrderTokenID",
  "swapOrderTokenSymbol",
  "swapOrderAmount",
  "swapOrderAmountsPretty",
  "swapOrderAmountRaw",
  "swapOrderPubKey",
  "swapOrderSignature",
  "swapOrderETHSignatureType",
  "swapOrderETHSignature",
  "swapOrderValidFrom",
  "swapOrderValidUntil",
  "swapSubmitterAccountID",
  "swapSubmitterAccountAddress",
  "newPkHash",
  "pubKey",
  "signature",
];

export type BalancesFieldNameKeys = "tokenID" | "tokenSymbol" | "amount" | "amountRaw";
export const balancesFieldKeys: BalancesFieldNameKeys[] = ["tokenID", "tokenSymbol", "amount", "amountRaw"];

export type NFTsFieldNameKeys = "tokenID" | "tokenSymbol" | "contentHash" | "creatorID" | "creatorAddress";
export const nftsFieldKeys: NFTsFieldNameKeys[] = [
  "tokenID",
  "tokenSymbol",
  "contentHash",
  "creatorID",
  "creatorAddress",
];

export type AccountInfoNameKeys =
  | "accountID"
  | "accountAddress"
  | "accountType"
  | "accountNonce"
  | "accountLastUpdateInBlock"
  | "pubKey";
export const accountInfoKeys: AccountInfoNameKeys[] = [
  "accountID",
  "accountAddress",
  "accountType",
  "accountNonce",
  "accountLastUpdateInBlock",
  "pubKey",
];

export type BlockInfoNameKeys =
  | "blockNumber"
  | "blockStatus"
  | "blockSize"
  | "commitTxHash"
  | "committedAt"
  | "verifyTxHash"
  | "finalizedAt"
  | "newStateRoot";
export const blockInfoKeys: BlockInfoNameKeys[] = [
  "blockNumber",
  "blockStatus",
  "blockSize",
  "commitTxHash",
  "committedAt",
  "verifyTxHash",
  "finalizedAt",
  "newStateRoot",
];

export const fieldsNames: Record<TransactionFieldNameKeys, string> = {
  createdAt: "Created at",
  txHash: "Transaction hash",
  ethTxHash: "Ethereum transaction hash",
  status: "Transaction status",
  type: "Transaction type",
  failReason: "Fail reason",
  isNFTOperation: "Is NFT operation",
  accountID: "Account ID",
  accountAddress: "Account address",
  accountType: "Account type",
  accountNonce: "Account nonce",
  accountLastUpdateInBlock: "Account last update in block",
  batchID: "Batch ID",
  blockNumber: "Block number",
  blockStatus: "Block status",
  blockSize: "Block size",
  blockIndex: "Transaction block index",
  commitTxHash: "Commit transaction hash",
  committedAt: "Committed at",
  verifyTxHash: "Verify transaction hash",
  finalizedAt: "Verified at",
  newStateRoot: "New state root",
  from: "From",
  to: "To",
  tokenID: "Token ID",
  tokenSymbol: "Token symbol",
  amount: "Amount",
  amountRaw: "Amount raw",
  feeTokenID: "Fee token ID",
  feeTokenSymbol: "Fee token symbol",
  feeAmount: "Fee amount",
  feeAmountRaw: "Fee amount raw",
  contentHash: "Content hash",
  creatorAddress: "Creator address",
  creatorID: "Creator ID",
  swapOrderAccountID: "Swap Order account ID",
  swapOrderAccountAddress: "Swap Order account address",
  swapOrderAccountNonce: "Swap Order account nonce",
  swapOrderTokenID: "Swap Order token ID",
  swapOrderTokenSymbol: "Swap Order token symbol",
  swapOrderAmount: "Swap Order amount",
  swapOrderAmountsPretty: "Swap amounts (pretty)",
  swapOrderAmountRaw: "Swap Order amount raw",
  swapOrderPubKey: "Swap Order public key",
  swapOrderSignature: "Swap Order signature",
  swapOrderETHSignatureType: "Swap Order ETH signature type",
  swapOrderETHSignature: "Swap Order ETH signature",
  swapOrderValidFrom: "Swap Order valid from",
  swapOrderValidUntil: "Swap Order valid until",
  swapSubmitterAccountID: "Swap submitter account ID",
  swapSubmitterAccountAddress: "Swap submitter account address",
  newPkHash: "New PK hash",
  pubKey: "Public key",
  signature: "Signature",
};
