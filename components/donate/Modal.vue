<template>
  <CommonModalGeneric>
    <template #default>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
        <HeartIcon class="h-6 w-6 text-pink-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Enjoying zkExport?</DialogTitle>
        <div class="mt-2">
          <p class="px-3 text-sm text-gray-500">
            Hello and thanks for stopping by!
            <br />
            If zkExport made your day a bit easier, feel free to buy me a coffee as a small 'thank you'.
            <br />
            Your appreciation warms my digital heart! ❤️
          </p>
        </div>

        <div class="mt-5">
          <div class="text-sm font-medium">My Ethereum / zkSync address</div>
          <div class="address-info-container mt-1">
            <Web3Avatar :address="info.ethereumAddress" class="address-info-avatar" />
            <div class="address-info-value">{{ info.ethereumAddress }}</div>
            <button class="info-copy-button" title="Copy address" @click="copy">
              <span class="copy-button-label">Copy address</span>
              <DocumentDuplicateIcon v-if="!copied" aria-hidden="true" class="copy-button-icon" />
              <CheckIcon v-else aria-hidden="true" class="copy-button-icon" />
            </button>
          </div>
          <div class="py-2 text-sm text-gray-600">or</div>
          <div class="label-info">
            <span>JackHamer.eth</span>
            <button title="Copy ENS name" @click="copyEns">
              <DocumentDuplicateIcon v-if="!copiedEns" aria-hidden="true" class="label-info-icon" />
              <CheckIcon v-else aria-hidden="true" class="label-info-icon copied" />
            </button>
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <CommonButton
        as="a"
        :icon="ArrowTopRightOnSquareIcon"
        icon-position="right"
        :href="`https://portal.txsync.io/transaction/send/?address=${info.ethereumAddress}`"
        target="_blank"
      >
        Send on zkSync
      </CommonButton>
    </template>
  </CommonModalGeneric>
</template>

<script lang="ts" setup>
import Web3Avatar from "web3-avatar-vue";
import { DialogTitle } from "@headlessui/vue";
import { ArrowTopRightOnSquareIcon, CheckIcon } from "@heroicons/vue/20/solid";
import { HeartIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/outline";

import useCopy from "@/composables/useCopy";

const info = {
  ens: "JackHamer.eth",
  ethereumAddress: "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044",
};

const { copied, copy } = useCopy(computed(() => info.ethereumAddress));
const { copied: copiedEns, copy: copyEns } = useCopy(computed(() => info.ens));
</script>

<style lang="scss" scoped>
.address-info-container {
  @apply grid grid-cols-[max-content_1fr_max-content] items-center gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-1.5 shadow-sm;

  .address-info-avatar {
    @apply h-10 w-10;
  }
  .address-info-value {
    @apply w-full overflow-hidden overflow-ellipsis text-sm;
  }
  .info-copy-button {
    @apply flex aspect-square h-10 rounded-full bg-blue-700 p-2.5 text-white transition-colors hover:bg-blue-800;

    .copy-button-label {
      @apply sr-only;
    }
    .copy-button-icon {
      @apply -mr-1 aspect-square h-full;
    }
  }
}
.label-info {
  @apply flex items-center justify-center text-lg font-medium leading-none text-black;

  .label-info-icon {
    @apply -mr-1 ml-1 h-5 w-5 text-gray-400 transition hover:text-gray-500;
    &.copied {
      @apply text-green-600;
    }
  }
}
</style>
