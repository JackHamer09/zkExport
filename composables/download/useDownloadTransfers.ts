import { format } from "date-fns";
import useFetchTransfers from "./useFetchTransfers";
import { getTransfersAwakenDownloadData, getTransfersDownloadData } from "@/utils/download/formatters/transfers";
import { Status } from "@/components/download/Modal.vue";

const FETCH_LIMIT_STEP = 10_000;
const FETCH_TIMEOUT_DELAY = 200;

export type DownloadTransferFormatter = "default" | "awaken";

export default () => {
  const { selectedChain } = storeToRefs(useNetworkStore());
  const { address, collection, total, finished, error, clear, fetchMore } = useFetchTransfers();

  const status = ref<Status>("not-started");
  const limit = ref(FETCH_LIMIT_STEP);
  const stopped = ref(false);

  const fetchToLimit = async () => {
    if (finished.value) {
      status.value = "finished";
      return;
    }
    if (collection.value.length >= limit.value || stopped.value) {
      status.value = "stopped";
      stopped.value = false;
      return;
    }
    status.value = "searching";
    if (collection.value.length) {
      await new Promise((resolve) => {
        setTimeout(resolve, FETCH_TIMEOUT_DELAY);
      });
    }
    await fetchMore();
    await fetchToLimit();
  };
  const startFetch = async (newAddress: string) => {
    limit.value = FETCH_LIMIT_STEP;
    status.value = "searching";
    stopped.value = false;
    clear();
    address.value = newAddress;
    await fetchToLimit();
  };
  const stopFetch = () => {
    stopped.value = true;
  };
  const continueFetch = async () => {
    if (collection.value.length >= limit.value) {
      limit.value = limit.value + FETCH_LIMIT_STEP;
    }
    await fetchToLimit();
  };
  const download = (formatter: DownloadTransferFormatter) => {
    const fileName = `Transactions_${address.value}_${format(new Date(), "HH-mm_MM-dd-yyyy")}`;
    const fileFormat = usePreferencesStore().downloadFormat.key;
    if (formatter === "default") {
      downloadData(
        getTransfersDownloadData(collection.value, {
          address: address.value!,
          networkName: selectedChain.value.name,
          l1NetworkName: selectedChain.value.l1Name,
        }),
        fileName,
        fileFormat
      );
    } else if (formatter === "awaken") {
      downloadData(
        getTransfersAwakenDownloadData(collection.value, {
          address: address.value!,
          networkName: selectedChain.value.name,
          l1NetworkName: selectedChain.value.l1Name,
        }),
        fileName,
        "csv"
      );
    }

    trackEvent(useGtag().gtag, "Download file", { formatter });
  };

  return {
    fetchedTotal: computed(() => collection.value.length),
    total,
    error,

    status,
    limit,
    startFetch,
    stopFetch,
    continueFetch,

    download,
  };
};
