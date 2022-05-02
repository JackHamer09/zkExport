<template>
  <div class="divider-container">
    <div class="divider-line"></div>
    <div class="divider-text">
      <slot />
    </div>
    <div class="divider-line"></div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.divider-container {
  @apply grid w-full grid-cols-[1fr_max-content_1fr] items-center gap-5;

  .divider-line {
    @apply h-px w-full bg-gray-300;
  }
  .divider-text {
    @apply text-xl font-semibold text-black;
  }
}
</style>
