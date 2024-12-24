<script setup>
const authStore = useAuthStore();

const outHandler = () => {
  authStore.clearCredentials();
  navigateTo("/login");
};
const memberStore = useMemberStore();
onMounted(async () => {
  const isManager = await checkManager();
  memberStore.setManager(isManager);
});

const isItemActive = (id) => {
  sidebarItems?.value?.forEach((item) => {
    if (item.id == id) return (item.isActive = true);
    item.isActive = false;
  });
};

const sidebarItems = ref([
  {
    name: "Home",
    icon: "material-symbols:home-app-logo",
    link: "/",
    isActive: true,
    id: 1,
  },
  {
    name: "Tasks",
    icon: "ix:tasks-open",
    isActive: false,
    link: "/tasks",
    id: 2,
  },
  {
    name: "New Task",
    icon: "material-symbols:bookmark-manager-outline",
    link: "/tasks/new",
    isActive: false,
    id: 3,
  },
  {
    name: "Users",
    icon: "material-symbols:person",
    link: "/users",
    isActive: false,
    id: 7,
  },
  {
    name: "Groups",
    icon: "material-symbols:groups",
    link: "/groups",
    isActive: false,
    id: 4,
  },
  {
    name: "Settings",
    icon: "material-symbols:settings",
    link: "/settings",
    isActive: false,
    id: 6,
  },
  {
    name: "Logout",
    icon: "material-symbols:logout",
    link: "/login",
    handler: outHandler,
    isActive: false,
    id: 5,
  },
]);
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-14 md:w-28 bg-[#212121] shadow-2xl md:rounded-xl my-8">
      <div
        class="w-full h-20 font-bold text-white mr-5 flex flex-col justify-center items-center md:mt-10"
      >
        <h1 class="text-3xl md:text-5xl text-[#5293ee]">G3.</h1>
      </div>
      <div class="w-full flex flex-col items-center text-white">
        <WebSidebarItem
          v-for="item in sidebarItems"
          :sidebarItem="item"
          @active="isItemActive"
          :key="item.id"
        >
        </WebSidebarItem>
      </div>
    </div>
  </div>
</template>
