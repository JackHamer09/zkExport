<template>
  <header class="header-container">
    <div class="header-grid">
      <NuxtLink :to="{ name: 'index' }" aria-label="Home" class="flex items-center">
        <img class="logo-image" src="/logo.svg" alt="zkExport" />
      </NuxtLink>

      <div class="right-section">
        <HeaderNetworkSwitcher />

        <HeaderDonateButton />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.header-container {
  @apply h-max py-5;

  .header-grid {
    @apply container flex justify-between;

    .logo-image {
      @apply h-5 w-auto sm:h-6;
    }

    .right-section {
      @apply flex items-center justify-end gap-3 md:gap-6;
    }
  }
}
</style>
