import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { $fetch } from "ohmyfetch";
import { ethers, type BigNumberish } from "ethers";
import { isNFT } from "zksync/build/utils";
import { logError } from "@/utils/logger";
import useNetwork from "./network";
import type { Request } from "@/types";

type Token = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
  enabledForFees: boolean;
};

export default defineStore("tokens", () => {
  const network = useNetwork();
  const isRequestPending = ref(false);
  const requestFail = ref(<boolean | string>false);
  const tokens = ref(<Token[]>[]);

  async function requestTokens() {
    if (!requestFail.value && tokens.value.length > 0) {
      return;
    }
    isRequestPending.value = true;
    requestFail.value = false;
    tokens.value = [];
    try {
      const fetchMore = async () => {
        const data: Request<Token> = await $fetch(
          `${network.apiDomain}/tokens?${new URLSearchParams({
            from: tokens.value.length.toString(),
            limit: "100",
            direction: "newer",
          })}`
        );
        if (!data || data.status !== "success") {
          throw new Error(data?.error?.message);
        }
        tokens.value.push(...data.result.list);
        if (data.result.list.length >= 100) {
          await fetchMore();
        }
      };
      await fetchMore();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      tokens.value = [];
      requestFail.value = (error && error.message ? error.message : error) || true;
      throw error;
    } finally {
      isRequestPending.value = false;
    }
  }

  function getTokenBySymbolOrID(tokenIDorSymbol: number | string) {
    if (typeof tokenIDorSymbol === "number") {
      for (const token of tokens.value) {
        if (token.id === tokenIDorSymbol) {
          return token;
        }
      }
    } else if (typeof tokenIDorSymbol === "string") {
      for (const token of tokens.value) {
        if (token.symbol === tokenIDorSymbol) {
          return token;
        }
      }
    }
  }

  function parseBigNumberish(amount: BigNumberish, tokenIDorSymbol: number | string): string {
    const token: Token | undefined = getTokenBySymbolOrID(tokenIDorSymbol);
    if (typeof tokenIDorSymbol === "number" && isNFT(tokenIDorSymbol)) {
      return "1";
    }
    if (token && amount) {
      try {
        return ethers.utils.formatUnits(amount, token.decimals).replace(/.0$/g, "");
      } catch (error) {
        logError(`Error parsing the token ${tokenIDorSymbol} with value ${amount}: ` + error);
      }
    }
    return "0";
  }

  function reset() {
    isRequestPending.value = false;
    requestFail.value = false;
    tokens.value = [];
  }

  watch(
    () => network.selectedNetwork,
    () => {
      reset();
    }
  );

  return {
    isRequestPending,
    requestFail,
    tokens,
    requestTokens,
    getTokenBySymbolOrID,
    parseBigNumberish,
  };
});
