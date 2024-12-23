<template>
  <div class="flex items-center justify-end bg-white px-4 py-3 dark:bg-black">
    <NuxtLink
      to="/settings"
      class="h-min w-min rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Icon name="material-symbols:settings" size="24" />
    </NuxtLink>
    <div
      class="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"
    ></div>
    <div class="hidden items-center justify-end md:flex">
      <span class="mx-3 text-gray-800 dark:text-white">
        Hello {{ currentUsername }}
      </span>
      <button
        class="hidden rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
        @click="handleSignOut"
      >
        Sign out
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const currentUsername = ref("");
authStore.loadFromLocalStorage();

currentUsername.value = authStore.username;

const handleSignOut = () => {
  authStore.clearCredentials();
  navigateTo("/login");
};
</script>
