<template>
  <div class="flex min-h-screen w-full bg-gray-50 text-gray-900">
    <UserSidebar />
    <main class="flex w-full flex-col bg-gray-50 pl-64">
      <UserNavbar />
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup></script>
