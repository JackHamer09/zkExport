<template>
  <div class="form-fields">
    <div class="space-y-6 bg-white px-4 py-5">
      <div class="grid grid-cols-6 gap-6">
        <slot></slot>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-3 text-right">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.form-fields {
  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }
}
</style>
