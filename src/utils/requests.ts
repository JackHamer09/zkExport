import { $fetch } from "ohmyfetch";
import useNetwork from "@/store/network";
import type { ApiAccountFullInfo, ApiBlockInfo } from "zksync/build/types";

export async function requestAccountState(address: string) {
  const network = useNetwork();
  const data = await $fetch(`${network.apiDomain}/accounts/${address}`);
  if (!data || data.status !== "success") {
    throw new Error(data?.error?.message);
  }
  if (!data.result?.committed) {
    throw new Error("Account wasn't found");
  }
  return <ApiAccountFullInfo>data.result;
}

export async function requestBlock(blockID: number | string) {
  const network = useNetwork();
  const data = await $fetch(`${network.apiDomain}/blocks/${blockID}`);
  if (!data || data.status !== "success") {
    throw new Error(data?.error?.message);
  }
  if (!data.result) {
    throw new Error("Block wasn't found");
  }
  return <ApiBlockInfo>data.result;
}
