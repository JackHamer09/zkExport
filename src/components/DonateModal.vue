<template>
  <Modal v-model:value="opened" :show-ad="false" type="heart" title="Buy me a coffee ❤️">
    <template #body>
      <div class="disclaimer">
        This website is not affiliated with Matter Labs. Do not send any tokens if you expect to receive an airdrop or
        any other benefit from Matter Labs / zkSync.
      </div>
      <div class="mt-2">
        ENS name
        <div class="flex items-center justify-center">
          <b>{{ ensName }}</b>
          <CopyButton class="ml-2" tooltip-position="left" :value="ensName" @copied="logEvent('Copy ENS Name')" />
        </div>
      </div>
      <div class="mt-2">
        zkSync address / Ethereum address
        <div class="flex items-center justify-center">
          <b><HashLabel :text="address" /></b>
          <CopyButton
            class="ml-2"
            tooltip-position="left"
            :value="address"
            @copied="logEvent('Copy Ethereum Address')"
          />
        </div>
      </div>
      <div class="mt-2">
        Binance BSC / Binance Ethereum address
        <div class="flex items-center justify-center">
          <b><HashLabel :text="binanceAddress" /></b>
          <CopyButton
            class="ml-2"
            tooltip-position="left"
            :value="binanceAddress"
            @copied="logEvent('Copy Binance Address')"
          />
        </div>
      </div>
    </template>
    <template #buttons>
      <Button
        size="md"
        color="zksync"
        tag="a"
        target="_blank"
        :href="`https://wallet.zksync.io/transaction/transfer?address=${address}`"
        class="w-full"
        @click="logEvent('Transfer on zkSync')"
      >
        <span>Transfer on zkSync</span>
        <ExternalLinkIcon class="ml-1.5 h-5 w-5" />
      </Button>
      <Button color="gray" outline class="mt-2 w-full" @click="opened = false">Close</Button>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ExternalLinkIcon } from "@heroicons/vue/outline";

import { logEvent } from "@/utils/logger";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import HashLabel from "@/components/common/HashLabel.vue";
import CopyButton from "@/components/common/CopyButton.vue";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:value", value: boolean): void;
}>();

const opened = computed({
  get: () => props.value,
  set: (value: boolean) => {
    emit("update:value", value);
  },
});

const ensName = "JackHamer.eth";
const address = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";
const binanceAddress = "0x761334bbbeb127092521c9d8af1f7c8fedd9f88f";
</script>

<style lang="scss" scoped>
.disclaimer {
  @apply text-xs font-semibold leading-tight;
}
</style>
