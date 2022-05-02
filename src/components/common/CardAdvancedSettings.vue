<template>
  <div class="mt-2 mb-1 border-y border-dashed py-2.5 sm:py-4">
    <div class="flex min-h-[1.75rem] cursor-pointer items-center justify-between" @click="opened = !opened">
      <h3 class="card-section-headline">Advanced settings</h3>
      <div class="flex items-center justify-end">
        <transition name="fade">
          <Button v-if="resetButtonVisible" size="xs" color="gray" outline class="mr-3" @click.stop="emit('reset')">
            Reset
          </Button>
        </transition>
        <ChevronDownIcon class="ml-1.5 h-5 w-5 sm:h-6 sm:w-6" :class="{ '-rotate-180': opened }" />
      </div>
    </div>
    <dl v-if="opened">
      <slot />
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import Button from "@/components/common/Button.vue";

defineProps({
  resetButtonVisible: {
    type: Boolean,
    default: null,
    required: false,
  },
});

const emit = defineEmits<{
  (eventName: "reset"): void;
}>();

const opened = ref(false);
</script>
