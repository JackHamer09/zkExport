import { $fetch } from "ofetch";

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

      const fetchUrl = next
        ? `${selectedChain.value.apiUrl}/${next}`
        : `${selectedChain.value.apiUrl}/address/${address.value}/transfers?limit=100`;
      const response = await $fetch<Api.Response.Collection<Api.Response.Transfer>>(fetchUrl);
      collection.value.push(...response.items);
      total.value = response.meta.totalItems;
      next = response.links.next;

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
