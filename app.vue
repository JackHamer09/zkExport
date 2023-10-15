<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<style lang="scss">
html {
  @apply h-full antialiased;
}

body {
  @apply w-full bg-white text-left font-sans text-black;

  * {
    @apply outline-offset-4 focus:outline-blue-700;
  }
}
</style>
