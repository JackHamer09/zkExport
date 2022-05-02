<template>
  <div class="card-container" :class="[{ 'no-footer': !$slots.footer }]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.card-container {
  @apply mx-auto max-w-2xl rounded-md bg-white shadow;
  &.no-footer {
    .card-body {
      @apply pb-4;
    }
  }

  .card-header {
    @apply rounded-t-lg pt-4;

    .card-section-headline {
      @apply text-base font-semibold sm:text-lg;
    }
  }
  .card-section-headline {
    @apply text-sm font-medium leading-6 text-gray-900 sm:text-base;
  }
  .card-footer {
    @apply rounded-b-lg py-3;
  }
  .card-header,
  .card-body,
  .card-footer {
    @apply px-4 sm:px-6;
  }
}
</style>
