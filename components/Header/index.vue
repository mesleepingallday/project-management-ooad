<script setup>
const authStore = useAuthStore();
const currentUsername = ref("");
authStore.loadFromLocalStorage();
currentUsername.value = authStore.username;

const dataStore = useDataStore();
const currentUser = useCurrentUser();
const userID = currentUser.value?.userId;

const taskData = [
  {
    text: "Task Completed",
    number: dataStore.getCompletedTask(),
  },
  {
    text: "Task Not Completed",
    number: dataStore.getNotCompletedTask(),
  },
];

const searched = ref(null);
const filteredData = ref(null);

const searchHandler = () => {
  dataStore.data.filter((item) => {
    if (
      item.title
        .toLocaleLowerCase()
        .startsWith(searched.value.toLocaleLowerCase())
    ) {
      filteredData.value = item;
    }
  });
};

const filteredHandler = () => {
  dataStore.setSelectedData(filteredData.value);
  dataStore.setModalChange();
};
</script>

<template>
  <div class="header">
    <HeaderWelcome :title="currentUsername"></HeaderWelcome>
    <div class="header__task">
      <div
        class="w-full h-8 relative rounded-t-xl bg-[#212121] text-white font-medium flex justify-center items-center px-2 py-1"
      >
        <SharedIcon
          icon="material-symbols-light:search-rounded"
          size="2em"
          color="text-gray-500"
        />
        <input
          class="w-full bg-transparent px-2 outline-none"
          v-model="searched"
          @input="searchHandler"
          type="text"
        />
        <div
          v-if="searched"
          class="w-full max-h-44 absolute cursor-pointer hover:text-blue-400 overflow-y-auto p-2 top-8 rounded-b-xl bg-[#121212] z-50"
        >
          <p v-if="filteredData" @click="filteredHandler">
            {{ filteredData?.title }}
          </p>
          <p v-else class="text-red-800">Search Not Found</p>
        </div>
      </div>
      <div class="w-full h-32 flex items-center justify-around mt-4">
        <HeaderItem
          v-for="data in taskData"
          :title="data.text"
          :number="data.number"
        ></HeaderItem>
      </div>
    </div>
    <div class="header__avatar">
      <div class="h-8 flex justify-center items-center">
        <div
          class="h-10 w-10 relative bg-[#212121] text-white font-medium rounded-xl flex justify-center items-center mr-2"
        >
          <SharedIcon
            icon="material-symbols:circle-notifications"
            size="5em"
            color="text-gray-300"
          />
          <span
            class="w-2 h-2 absolute top-1 right-1 rounded-full bg-red-500"
          ></span>
        </div>
        <div></div>
      </div>
      <div class="w-full h-32 flex items-center justify-around mt-4 text-white">
        <!--Total points-->
      </div>
      <TaskDetails v-if="dataStore.isModalActive"></TaskDetails>
    </div>
  </div>
</template>

<style scoped>
.header {
  @apply w-full md:h-44 px-5 md:flex md:items-center md:justify-between;
}

.header__task {
  @apply w-[90%] sm:w-[70%] md:w-[2/3] lg:w-[30%] md:h-full flex flex-col rounded-3xl mx-auto md:mx-0;
}

.header__avatar {
  @apply w-[90%] sm:w-[70%] md:w-[33%] lg:w-[15%] md:h-full flex flex-col mx-auto md:mx-0 mt-10 md:mt-0  rounded-3xl justify-between;
}
</style>
