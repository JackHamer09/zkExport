<template>
  <div class="w-full">
    <div id="hero-block" class="circles-container">
      <div class="relative isolate">
        <div
          class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400/70 to-purple-500/70 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style="
              clip-path: polygon(
                74.1% 44.1%,
                100% 61.6%,
                97.5% 26.9%,
                85.5% 0.1%,
                80.7% 2%,
                72.5% 32.5%,
                60.2% 62.4%,
                52.4% 68.1%,
                47.5% 58.3%,
                45.2% 34.5%,
                27.5% 76.7%,
                0.1% 64.9%,
                17.9% 100%,
                27.6% 76.8%,
                76.1% 97.7%,
                74.1% 44.1%
              );
            "
          />
        </div>
        <div
          class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-600/70 to-blue-600/80 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style="
              clip-path: polygon(
                74.1% 44.1%,
                100% 61.6%,
                97.5% 26.9%,
                85.5% 0.1%,
                80.7% 2%,
                72.5% 32.5%,
                60.2% 62.4%,
                52.4% 68.1%,
                47.5% 58.3%,
                45.2% 34.5%,
                27.5% 76.7%,
                0.1% 64.9%,
                17.9% 100%,
                27.6% 76.8%,
                76.1% 97.7%,
                74.1% 44.1%
              );
            "
          />
        </div>
      </div>
    </div>
    <div ref="heroEl" class="hero-container">
      <div class="w-full text-center">
        <a
          href="https://awaken.tax/?ref=zkexport"
          target="_blank"
          class="group mx-auto mb-6 flex w-max rounded-3xl opacity-80 hover:opacity-100 focus:opacity-100 sm:justify-center"
          @click.passive="trackEvent(useGtag().gtag, 'awaken.tax clicked')"
        >
          <div
            class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 transition group-hover:ring-gray-900/20"
          >
            Need to do your crypto taxes?
            <span class="font-semibold text-blue-700">
              <span class="absolute inset-0" aria-hidden="true" />Try awaken.tax
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </a>
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Export transactions</h1>
        <p class="mx-auto mt-5 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
          Effortlessly export <span class="font-medium text-blue-700">zkSync Era</span> transactions to CSV, XLS, JSON
          and more
        </p>
        <form class="search-form" role="search" @submit.prevent="formSubmit">
          <label class="input-container" for="address-input">
            <span class="relative block h-max w-full">
              <input
                id="address-input"
                ref="textarea"
                v-model.trim="inputted"
                name="address"
                autofocus
                :placeholder="inputPlaceholder"
                :pattern="inputPattern"
                required
                spellcheck="false"
                class="search-value-style search-input"
              />
            </span>
          </label>
          <button class="search-submit-button" title="Fetch all transactions" type="submit">
            <span class="search-label">Fetch all transactions</span>
            <MagnifyingGlassIcon aria-hidden="true" class="search-label-icon" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  inputPlaceholder: {
    type: String,
    required: true,
  },
  inputPattern: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string): void;
  (eventName: "submit"): void;
}>();
const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const formSubmit = () => {
  emit("submit");
};
</script>

<style lang="scss" scoped>
.circles-container,
.hero-container {
  @apply h-max w-full sm:pb-6;
}
.circles-container {
  @apply pointer-events-none absolute left-0 top-[var(--header-height)];
}
.hero-container {
  @apply sticky top-0 mx-auto flex w-full max-w-2xl items-center;

  .search-form {
    @apply mt-8 flex items-center gap-2 sm:gap-4;

    .input-container {
      @apply h-max w-full cursor-text overflow-hidden rounded-3xl border-2 border-gray-300 bg-white/50 px-4 py-4 transition-colors hover:border-gray-400 sm:px-6;
      &:focus-within {
        @apply border-blue-700;
      }

      .search-input {
        @apply block w-full resize-none border-none bg-transparent outline-none;
        @apply text-left text-base font-medium text-black sm:text-xl;
      }
    }
    .search-submit-button {
      @apply flex aspect-square h-10 rounded-full bg-blue-700 p-2.5 text-white transition-colors hover:bg-blue-800 sm:h-12 sm:p-3;

      .search-label {
        @apply sr-only;
      }
      .search-label-icon {
        @apply -mr-1 aspect-square h-full;
      }
    }
  }
}
</style>
