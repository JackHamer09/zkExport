<template>
  <Modal v-model:value="opened" type="heart" title="Buy me a coffee ❤️">
    <template #body>
      <div>
        ENS name
        <div class="flex items-center justify-center">
          <b>JackHamer.eth</b>
          <CopyButton class="ml-2" tooltip-position="left" :value="address" />
        </div>
      </div>
      <div class="mt-2">
        zkSync address / Ethereum address
        <div class="flex items-center justify-center">
          <b><HashLabel :text="address" /></b>
          <CopyButton class="ml-2" tooltip-position="left" :value="address" />
        </div>
      </div>
      <div class="mt-2">
        Binance BSC / Binance Ethereum address
        <div class="flex items-center justify-center">
          <b><HashLabel :text="binanceAddress" /></b>
          <CopyButton class="ml-2" tooltip-position="left" :value="binanceAddress" />
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

const address = "0x11Ed0AC7D6142481E459B6e5d4bfB5646277796f";
const binanceAddress = "0xd3f1474abb8ba03cbe83120f4796cb3793bcb2f8";
</script>
