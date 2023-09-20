<template>
  <TransitionRoot as="template" :show="opened">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block transform rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"
          >
            <div>
              <div
                v-if="type === 'success'"
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
              >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div
                v-else-if="type === 'stop'"
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100"
              >
                <StopIcon class="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div
                v-else-if="type === 'loading'"
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100"
              >
                <Spinner color="indigo" size="sm" />
              </div>
              <div
                v-else-if="type === 'error'"
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
              >
                <ExclamationIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div
                v-else-if="type === 'heart'"
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100"
              >
                <HeartIcon class="h-6 w-6 text-pink-600" aria-hidden="true" />
              </div>

              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-neutral-900">
                  {{ title }}
                </DialogTitle>
                <div class="mt-2 text-sm text-neutral-500">
                  <slot name="body" />
                </div>
              </div>
            </div>
            <div v-if="$slots.buttons" class="mt-5 sm:mt-6">
              <slot name="buttons" />
            </div>
            <div v-if="showAd" class="mt-5 w-full border-t border-dashed sm:mt-6">
              <div class="group relative">
                <h3 class="mt-4 font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a
                    href="https://awaken.tax/?ref=zkexport"
                    target="_blank"
                    @click.passive="logEvent('awaken.tax clicked')"
                  >
                    <span class="absolute inset-0" />
                    Need to do your crypto taxes?
                  </a>
                </h3>
                <p class="line-clamp-3 mt-1 text-sm text-gray-600">
                  Try out
                  <a
                    class="text-indigo-600"
                    href="https://awaken.tax/?ref=zkexport"
                    target="_blank"
                    @click.passive="logEvent('awaken.tax clicked')"
                    >awaken.tax</a
                  >! They support dozens of exchanges/blockchains and are fine-tuned for DeFi & NFT
                </p>
                <Button
                  as="a"
                  href="https://awaken.tax/?ref=zkexport"
                  target="_blank"
                  color="indigo"
                  outline
                  class="mt-2 w-full sm:-mb-1.5"
                  @click.passive="logEvent('awaken.tax clicked')"
                >
                  Get free $30 bonus&nbsp;<span aria-hidden="true">&rarr;</span>
                </Button>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { CheckIcon, ExclamationIcon, StopIcon, HeartIcon } from "@heroicons/vue/outline";
import { logEvent } from "@/utils/logger";
import Button from "./Button.vue";
import Spinner from "./Spinner.vue";

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    required: false,
  },
  allowClose: {
    type: Boolean,
    default: true,
    required: false,
  },
  showAd: {
    type: Boolean,
    default: true,
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

function close() {
  if (props.allowClose) {
    opened.value = false;
  }
}
</script>
