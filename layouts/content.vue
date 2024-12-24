<script setup>
const dataStore = useDataStore();
</script>

<template>
  <div class="main">
    <WebSidebar />
    <div class="main__content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.main {
  @apply w-full lg:h-full  bg-[#121212] flex items-center justify-center overflow-y-auto;
}

.main__content {
  @apply w-full h-full md:h-[90%] lg:w-[75%] lg:h-[90%] flex flex-col items-center;
}
</style>
