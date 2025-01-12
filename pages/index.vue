<script setup>
const dataStore = useDataStore();
const memberStore = useMemberStore();
await memberStore.fetchPersonalTasks();
dataStore.setTasks(memberStore.personalTasks);

definePageMeta({
  layout: "content",
});

const status = ref([
  {
    name: "All",
    isActive: true,
  },
  {
    name: "Pending",
    isActive: false,
  },
  {
    name: "In Progress",
    isActive: false,
  },
  {
    name: "Completed",
    isActive: false,
  },
]);

const selectedStatus = ref("All");

const filterHandler = (data) => {
  selectedStatus.value = data;
  status?.value?.forEach((item) => {
    if (item.name == data) return (item.isActive = true);
    item.isActive = false;
  });
};

const selectFilter = computed(() => {
  return dataStore?.data?.filter((item) => {
    if (selectedStatus.value === "All") {
      return item;
    }
    return item.status === selectedStatus.value;
  });
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <Header> </Header>
    <div
      class="w-full h-full lg:h-[80%] flex-col lg:flex lg:flex-row justify-between"
    >
      <div
        class="scroll-bar w-[90%] lg:w-[55%] lg:h-[350px] mx-auto md:mt-5 md:ml-7 pl-3 flex flex-col text-white overflow-y-auto"
      >
        <h1 class="text-2xl">Tasks</h1>
        <div class="w-full mt-2 text-start">
          <SharedButton
            v-for="statu in status"
            :handler="() => filterHandler(statu.name)"
            :text="statu.name"
            :class="{ 'text-[#5293ee]': statu.isActive }"
            class="px-1 mr-2 py-1 cursor-pointer hover:text-[#5293ee]"
          >
          </SharedButton>
        </div>
        <CardList v-for="task in selectFilter" :task="task"></CardList>
      </div>
      <Statistic></Statistic>
    </div>
    <TaskDetails v-if="dataStore.isModalActive"></TaskDetails>
  </div>
</template>

<style scoped>
.Todo {
  border: 1px solid red;
}

.Inprogress {
  border: 1px solid yellow;
}

.Done {
  border: 1px solid green;
}

.Backlog {
  border: 1px solid #5293ee;
}
</style>
