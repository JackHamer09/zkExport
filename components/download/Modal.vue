<template>
  <CommonModalGeneric
    :open="modalShow"
    :close-on-bg="fetchedTotal === 0"
    @close="close"
    @after-leave="modalOpened = false"
  >
    <template #default>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" :class="icon.bgClass">
        <component :is="icon.component" class="h-6 w-6" :class="icon.componentClass" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">{{ title }}</DialogTitle>
        <div class="mt-2">
          <p class="px-3 text-sm text-gray-500">
            <template v-if="modalStatus === 'searching'">
              <b>{{ fetchedTotal }}</b
              >{{ totalFormatted }} transfers already saved from
              <span class="network-name">{{ selectedChain.name }}</span>
            </template>
            <template v-else-if="modalStatus === 'finished' || modalStatus === 'stopped'">
              <b>{{ fetchedTotal }}</b
              >{{ totalFormatted }} transfers were saved from
              <span class="network-name">{{ selectedChain.name }}</span>
            </template>
            <template v-else-if="modalStatus === 'nothing-found'">
              There were no transfers found for specified address on
              <span class="network-name">{{ selectedChain.name }}</span>
            </template>
            <template v-else-if="modalStatus === 'error'">
              <b>{{ fetchedTotal }}</b
              >{{ totalFormatted }} transfers were saved from
              <span class="network-name">{{ selectedChain.name }}</span> but stopped with an error:
              <br />
              <span class="text-red-600">{{ error?.message || error }}</span>
            </template>
          </p>
          <div
            v-if="limitWasHit"
            class="mt-2 rounded-3xl bg-yellow-50 p-4 text-sm text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
          >
            Fetching was automatically stopped because amount of transfers has hit a limit. Press the button bellow if
            you wish to continue.
          </div>
        </div>
      </div>
    </template>

    <template v-if="modalStatus === 'searching'" #buttons>
      <CommonButton :icon="StopCircleIcon" variant="warning" @click="emit('stop')">Stop</CommonButton>
    </template>
    <template v-else-if="modalStatus === 'finished'" #buttons>
      <DownloadButton @click="emit('download', 'default')">Download {{ fetchedTotal }} transfers</DownloadButton>
    </template>
    <template v-else-if="modalStatus === 'stopped'" #buttons>
      <CommonButton :icon="ArrowUturnUpIcon" variant="warning" @click="emit('continue')">Continue</CommonButton>
      <DownloadButton v-if="fetchedTotal > 0" @click="emit('download', 'default')">
        Download {{ fetchedTotal }} transfers
      </DownloadButton>
    </template>
    <template v-else-if="modalStatus === 'error'" #buttons>
      <CommonButton :icon="ArrowPathIcon" variant="error" @click="emit('continue')">Try again</CommonButton>
      <DownloadButton v-if="fetchedTotal > 0" @click="emit('download', 'default')">
        Download {{ fetchedTotal }} transfers
      </DownloadButton>
    </template>

    <template #secondary-modal>
      <div class="text-center">
        <h5 class="mb-1 text-base font-semibold leading-6 text-gray-700">Need to do your crypto taxes?</h5>
        <p class="px-3 text-sm text-gray-500">
          Try out
          <a
            href="https://awaken.tax/?ref=zkexport"
            target="_blank"
            class="text-blue-700"
            @click.passive="trackEvent(useGtag().gtag, 'awaken.tax clicked')"
            >awaken.tax</a
          >! They support dozens of exchanges/blockchains and are fine-tuned for DeFi & NFT
        </p>
      </div>
      <div class="mt-2 flex gap-3">
        <CommonButton
          as="a"
          href="https://awaken.tax/?ref=zkexport"
          target="_blank"
          :icon="ArrowUpRightIcon"
          icon-position="right"
          variant="success"
          size="sm"
          @click="emit('continue')"
          @click.passive="trackEvent(useGtag().gtag, 'awaken.tax clicked')"
        >
          Get free $30 bonus
        </CommonButton>
        <button
          v-if="fetchedTotal > 0 && ['finished', 'stopped', 'error'].includes(modalStatus)"
          class="flex aspect-square h-10 rounded-full bg-blue-700 p-2.5 text-white transition-colors hover:bg-blue-800"
          title="Download transfers in awaken.tax format"
          @click="emit('download', 'awaken')"
        >
          <span class="sr-only">Download transfers in awaken.tax format</span>
          <ArrowDownTrayIcon aria-hidden="true" class="-mr-1 aspect-square h-full" />
        </button>
      </div>
    </template>
  </CommonModalGeneric>
</template>

<script lang="ts" setup>
import { DialogTitle } from "@headlessui/vue";
import {
  ArrowPathIcon,
  ArrowUturnUpIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  StopCircleIcon,
  StopIcon,
} from "@heroicons/vue/24/outline";
import { ArrowUpRightIcon } from "@heroicons/vue/20/solid";
import Spinner from "@/components/common/Spinner.vue";
import { DownloadTransferFormatter } from "@/composables/download/useDownloadTransfers";
import { API_TRANSFERS_LIMIT } from "@/composables/download/useFetchTransfers";

export type Status = "not-started" | "stopped" | "searching" | "finished";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<Status>,
    required: true,
  },
  fetchedTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: [Number, null] as PropType<number | null>,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  error: {
    type: [Error, null] as PropType<Error | null>,
  },
});

const emit = defineEmits<{
  (eventName: "update:open", value: boolean): void;
  (eventName: "stop"): void;
  (eventName: "continue"): void;
  (eventName: "download", formatter: DownloadTransferFormatter): void;
}>();

const modalOpened = computed({
  get: () => props.open,
  set: (state: boolean) => emit("update:open", state),
});

const modalShow = ref(modalOpened.value);
watch(modalOpened, (state) => (modalShow.value = state));
const close = () => {
  if (modalStatus.value === "searching") {
    return emit("stop");
  }
  modalShow.value = false;
};

const { selectedChain } = storeToRefs(useNetworkStore());

const modalStatus = computed(() => {
  if (props.error) {
    return "error";
  } else if (props.status === "finished" && props.fetchedTotal === 0) {
    return "nothing-found";
  }
  return props.status;
});
const title = computed(() => {
  switch (modalStatus.value) {
    case "searching":
      return "Fetching transactions...";
    case "stopped":
      return "Fetching stopped";
    case "finished":
      return "Fetching successful";
    case "nothing-found":
      return "Nothing found";
    case "error":
      return "Fetching error";

    default:
      return "";
  }
});
const icon = computed(() => {
  switch (modalStatus.value) {
    case "finished":
      return {
        component: CheckIcon,
        componentClass: "text-green-600",
        bgClass: "bg-green-100",
      };
    case "stopped":
      return {
        component: StopIcon,
        componentClass: "text-yellow-600",
        bgClass: "bg-yellow-100",
      };
    case "nothing-found":
      return {
        component: ExclamationTriangleIcon,
        componentClass: "text-yellow-600",
        bgClass: "bg-yellow-100",
      };
    case "error":
      return {
        component: ExclamationCircleIcon,
        componentClass: "text-red-600",
        bgClass: "bg-red-100",
      };

    case "searching":
    default:
      return {
        component: Spinner,
        componentClass: "text-blue-700",
        bgClass: "bg-neutral-100",
      };
  }
});
const totalFormatted = computed(() => {
  if (!props.total) {
    return "";
  }
  if (props.total % API_TRANSFERS_LIMIT === 0) {
    return `/${props.total}+`;
  }
  return `/${props.total}`;
});
const limitWasHit = computed(() => modalStatus.value === "stopped" && props.fetchedTotal >= props.limit);
</script>

<style lang="scss" scoped>
.network-name {
  @apply whitespace-nowrap font-medium text-blue-700;
}
</style>
