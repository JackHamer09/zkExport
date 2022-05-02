<template>
  <div id="appContainer" :class="{ 'is-home-route': route.name === 'home' }">
    <Header />
    <div class="router-view">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="transition ease duration-500 delay-150"
          enter-from-class="opacity-0 translate-y-5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute left-0 top-0 w-full transition ease duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-5"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
</script>

<style lang="scss">
#app {
  @apply bg-gray-100;

  #appContainer {
    @apply grid h-full min-h-screen grid-rows-[max-content_1fr_max-content];
    &.is-home-route {
      @apply bg-gradient-to-r from-indigo-600 to-indigo-500;
    }

    .router-view {
      @apply container relative pb-14;
    }
  }
}
.page-headline {
  @apply w-full py-8 text-center text-2xl font-semibold text-white sm:py-12 sm:text-3xl;
}
</style>
