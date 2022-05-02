import { ethers } from "ethers";

export function isAddress(address?: string | null): boolean {
  if (!address) return false;
  return ethers.utils.isAddress(address);
}

export const isTransactionHash = (hash?: string | null) => {
  if (!hash) return false;
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

export const isBlockID = (blockID?: string | null) => {
  if (!blockID) return false;
  return /^[0-9*+-]+$/.test(blockID);
};
