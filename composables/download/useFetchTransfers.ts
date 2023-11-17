import { $fetch } from "ofetch";

export const API_TRANSFERS_LIMIT = 10_000;

export default () => {
  const { selectedChain } = storeToRefs(useNetworkStore());

  const address = ref<null | string>(null);
  const collection = ref<Api.Response.Transfer[]>([]);
  const total = ref<null | number>(null);
  let next: null | string = null;
  const finished = ref(false);

  const clear = () => {
    address.value = null;
    collection.value = [];
    total.value = null;
    next = null;
    finished.value = false;
  };

  const buildApiUrl = (params: { address: string; toDate?: string; limit?: number; page?: number }): string => {
    const url = new URL(`${selectedChain.value.apiUrl}/address/${params.address}/transfers`);

    const limit = params.limit ?? 100;
    url.searchParams.append("limit", limit.toString());

    if (params.toDate) {
      url.searchParams.append("toDate", params.toDate);
    }
    if (params.page) {
      url.searchParams.append("page", params.page.toString());
    }

    return url.toString();
  };

  /* const getTotalTransfers = async (address: string): Promise<number> => {
    let total = 0;
    const items: Api.Response.Transfer[][] = [];
    let toDate: string | undefined;

    const requestBatch = async (page = 1) => {
      const fetchUrl = buildApiUrl({ address, toDate, page });
      return await $fetch<Api.Response.Collection<Api.Response.Transfer>>(fetchUrl);
    };

    while (true) {
      const response = await requestBatch(100);

      items.push(response.items);
      total += response.meta.totalItems;

      if (response.meta.totalItems < API_TRANSFERS_LIMIT) {
        break;
      }

      // Update toDate to the timestamp of the last item in the current batch
      toDate = response.items[response.items.length - 1].timestamp;
    }

    return total;
  }; */

  const {
    inProgress,
    error,
    execute: fetchMore,
  } = usePromise(
    async () => {
      if (!address.value || !isValidAddress(address.value)) {
        throw new Error("Invalid Ethereum address!");
      }

      if (finished.value) {
        return;
      }

      const fetchUrl = next ? `${selectedChain.value.apiUrl}/${next}` : buildApiUrl({ address: address.value });
      const response = await $fetch<Api.Response.Collection<Api.Response.Transfer>>(fetchUrl);
      collection.value.push(...response.items);
      if (collection.value.length > response.meta.totalItems) {
        total.value =
          collection.value.length - (collection.value.length % API_TRANSFERS_LIMIT) + response.meta.totalItems;
      } else {
        total.value = response.meta.totalItems;
      }
      if (response.links.next === response.links.last && response.meta.totalItems === API_TRANSFERS_LIMIT) {
        const lastTransfer = response.items[response.items.length - 1];
        next = buildApiUrl({ address: address.value, toDate: lastTransfer.timestamp }).substring(
          // remove `apiUrl/` from the url to make it consistent with `next` from Block Explorer API
          selectedChain.value.apiUrl.length + 1
        );
      } else {
        next = response.links.next;
      }

      if (!next) {
        finished.value = true;
      }
    },
    { cache: false }
  );

  return {
    address,
    collection,
    total,
    inProgress,
    finished,
    error,

    clear,
    fetchMore,
  };
};
