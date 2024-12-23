<script setup>
definePageMeta({
  layout: "content",
});
const memberStore = useMemberStore();
onMounted(async () => {
  const isManager = await checkManager();
  memberStore.setManager(isManager);
});
const status = ["Backlog", "Pending", "In Progress", "Completed"];
const taskCategories = [
  { name: "All", value: "all" },
  { name: "Personal", value: "personal" },
];
const selectedCategory = ref("personal");
const isDragItem = ref(false);
const dataStore = useDataStore();
const fetchTasks = async (e) => {
  if (e) {
    selectedCategory.value = e.value || "personal";
  }
  console.log(selectedCategory.value);
  dataStore.clearData();
  if (selectedCategory.value === "all") {
    await memberStore.fetchAllTasks();
    dataStore.setTasks(memberStore.allTasks);
  } else {
    await memberStore.fetchPersonalTasks();
    dataStore.setTasks(memberStore.personalTasks);
  }
  isDragItem.value = !isDragItem.value;
};
fetchTasks();
</script>
<template>
  <div class="flex flex-col gap-8 w-full h-full overflow-y-hidden">
    <Toast />
    <div class="card flex justify-center">
      <Select
        v-if="memberStore.isManager"
        v-model="selectedCategory"
        :options="taskCategories"
        optionLabel="name"
        optionValue="value"
        defaultValue="personal"
        class="w-full md:w-56"
        @change="fetchTasks"
      />
    </div>
    <div
      class="w-full h-full overflow-y-hidden grid grid-cols-1 md:grid-cols-2 md:min-h-screen xl:flex justify-center items-center text-white"
    >
      <div
        v-for="statu in status"
        class="w-full scroll-bar overflow-y-auto px-5 h-full flex flex-col items-center"
        @drop="dataStore.DropData($event, statu)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div
          class="bg-[#212121] rounded-xl w-full sm:w-1/2 md:w-[80%] xl:w-full 2xl:w-[85%] py-3 mb-3 flex justify-center items-center"
        >
          <h1 class="text-xl font-bold" :class="statu">{{ statu }}</h1>
        </div>
        <div
          class="w-full sm:w-1/2 md:w-[80%] xl:w-full 2xl:w-[85%] flex flex-col items-center"
        >
          <TaskItem
            v-for="data in dataStore.getData(statu)"
            :item="data"
            :statu="statu"
            :isDragItem="isDragItem"
            @task-updated="fetchTasks"
          />
        </div>
      </div>
      <TaskDetails v-if="dataStore.isModalActive"></TaskDetails>
    </div>
  </div>
</template>

<style scoped>
.Todo {
  color: #f06868;
}

.Inprogress {
  color: #f8da5b;
}

.Completed {
  color: #7dd87d;
}

.Backlog {
  color: #5293ee;
}
</style>
