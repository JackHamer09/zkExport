<template>
  <Card class="quick-actions-card">
    <template #header>
      <h3 class="card-section-headline">Required Information</h3>
    </template>
    <template #default>
      <slot />
    </template>
  </Card>
</template>

<script lang="ts" setup>
import Card from "@/components/common/Card.vue";
</script>

<style lang="scss">
.quick-actions-card {
  .quick-actions-divider {
    @apply mt-8 mb-6 w-full border-t border-dashed;
    &:nth-child(2) {
      @apply mt-4 sm:mt-5;
    }
  }
  .quick-action-group {
    @apply w-full text-left;

    .quick-actions-group-headline {
      @apply mb-3 font-semibold leading-tight text-gray-800;
    }
    .quick-actions-grid {
      @apply grid grid-flow-row-dense grid-cols-2 gap-3;

      .quick-action-button {
        @apply h-full w-full appearance-none rounded-md border bg-white p-2 pb-2.5 sm:p-4;
        &:not(.custom-select) {
          @apply flex cursor-pointer flex-col transition-colors hover:border-indigo-600;
        }
        &.custom-select {
          @apply col-span-2 grid grid-cols-3 items-center gap-2 sm:grid-cols-[max-content_1fr_max-content] sm:gap-4;

          .middle-col {
            @apply col-span-3 w-full xs:col-span-2 sm:col-span-1;
          }
          .action-text-content {
            @apply col-span-3 sm:col-span-1 sm:pr-5;
          }
          .button {
            @apply col-span-3 xs:col-span-1;
          }
        }
        .action-name {
          @apply text-left text-sm font-semibold leading-tight text-gray-800;
        }
        .action-description {
          @apply m-0 mt-0.5 text-left text-xs font-normal leading-tight text-gray-500;
        }
      }
    }
  }
}
</style>
