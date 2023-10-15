<template>
  <TransitionRoot as="template" :show="modalOpened" @after-leave="emit('after-leave')">
    <Dialog as="div" class="relative z-10" @close="closeOnBgClick">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full flex-col justify-end p-4 text-center sm:items-center sm:justify-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="transform transition-all sm:mb-2 sm:mt-8 sm:w-full sm:max-w-sm">
              <div class="relative rounded-3xl bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:p-6">
                <div class="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    class="rounded-full bg-white text-gray-400 hover:text-gray-500"
                    @click="modalOpened = false"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <slot />
                </div>
                <div v-if="$slots['buttons']" class="mt-5 flex flex-col gap-2 sm:mt-6">
                  <slot name="buttons" />
                </div>
              </div>
              <div
                v-if="$slots['secondary-modal']"
                class="mt-4 rounded-3xl bg-white px-4 pb-3 pt-3 text-left opacity-70 shadow-xl transition-opacity focus-within:opacity-100 hover:opacity-100 sm:-mb-28 sm:px-6 sm:py-4"
              >
                <slot name="secondary-modal" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  closeOnBg: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:open", value: boolean): void;
  (eventName: "close"): void;
  (eventName: "after-leave"): void;
}>();

const modalOpened = computed({
  get: () => props.open,
  set: (state: boolean) => {
    emit("update:open", state);
    if (!state) {
      emit("close");
    }
  },
});

const closeOnBgClick = () => {
  if (props.closeOnBg) {
    modalOpened.value = false;
  }
};
</script>
