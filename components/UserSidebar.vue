<template>
  <div
    class="fixed h-full justify-between shadow-xl transition-all duration-300 z-40 overflow-y-auto bg-white"
  >
    <div
      class="z-50 flex flex-col min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3"
    >
      <div class="text-xl font-bold text-gray-800">HUST</div>

      <!--BTL info-->
      <div
        class="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700"
      >
        <div>
          <h3 class="text-md font-bold tracking-tighter dark:text-gray-200">
            TODOLIST- GROUP 3
          </h3>
        </div>
      </div>

      <!--NAVBAR-->
      <nav class="z-10 mt-12">
        <NuxtLink v-for="item in navLink" :key="item.name" :to="item.path">
          <span class="flex flex-row gap-4 items-center mt-4">
            <Icon :name="item.icon" size="28" />
            <span class="font-medium text-gray-800 dark:text-gray-100">
              {{ item.name }}
            </span>
          </span>
        </NuxtLink>
      </nav>

      <!--GROUP TASKS-->
      <Button variant="link" @click="showGroup = !showGroup" class="mt-4">
        <span class="flex flex-row gap-2 items-center">
          <Icon
            v-if="showGroup"
            name="material-symbols:arrow-drop-up"
            size="20"
          />
          <Icon v-else name="material-symbols:arrow-drop-down" size="20" />
          <span class="font-medium text-gray-800 dark:text-gray-100">
            Group
          </span>
        </span>
      </Button>
      <div v-if="showGroup" class="flex flex-col gap-2">
        <h2>Group tasks</h2>
      </div>
    </div>

    <!--CURRENT USER INFO-->
    <div
      class="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 md:hidden"
    >
      <div class="flex w-full items-center">
        <div class="align-center flex items-center justify-center">
          <span class="mx-3 text-blue-800 font-bold dark:text-white">
            {{ currentUsername }}
          </span>
          <Button
            class="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            @click="handleSignOut"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const showGroup = ref(false);
const authStore = useAuthStore();
const currentUsername = ref("");

onMounted(() => {
  authStore.loadFromLocalStorage();
  currentUsername.value = authStore.username;
});

const navLink = [
  {
    name: "Dashboard",
    path: "/",
    icon: "material-symbols:dashboard",
  },
  {
    name: "Personal tasks",
    path: "/tasks/personal",
    icon: "material-symbols:person",
  },
];

const handleSignOut = () => {
  authStore.clearCredentials();
  navigateTo("/login");
};
</script>
