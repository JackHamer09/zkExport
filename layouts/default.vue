<template>
  <div class="default-layout">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.default-layout {
  @apply grid min-h-screen grid-rows-[max-content_1fr_max-content];
  min-height: 100dvh;
}
</style>
