<script setup>
const dataStore = useDataStore();

const closeHandler = () => {
  dataStore.setModalChange();
};
</script>

<template>
  <div class="modal">
    <div class="modal__layer"></div>
    <div class="modal__content relative">
      <div class="w-1/2 hidden md:block h-full rounded-xl">
        <!--Image-->
      </div>
      <div
        class="w-full md:w-1/2 h-full px-5 md:border-l md:border-dashed border-gray-300"
      >
        <div class="w-full h-12 p-2 flex justify-between items-center mt-8">
          <Badge
            size="w-14"
            :text="dataStore.selected.category"
            :color="dataStore.selected.category"
            :background="dataStore.selected.category"
          >
          </Badge>
          <Badge size="w-12" color="text-green-900" background="bg-green-200">
            <span> +{{ dataStore.selected.point }} </span>
          </Badge>
          <Badge
            size="w-20"
            :text="dataStore.selected.date"
            color="text-slate-800"
            background="bg-[#edf0f7]"
          >
          </Badge>
        </div>
        <div class="w-full h-[50%] p-2">
          <h1 class="text-md font-bold text-slate-600">
            {{ dataStore.selected.title }}
          </h1>
          <p class="text-sm text-slate-900">
            {{ dataStore.selected.description }}
          </p>
        </div>
        <div
          class="w-full h-12 mt-2 p-2 mb-3 flex justify-between items-center"
        >
          <div class="w-full gap-2 flex items-center flex-wrap">
            <SharedAvatar
              v-for="data in dataStore.getMemberCount(
                dataStore.selected.taskID
              )"
              size="w-10 h-10"
              :pic="data.image"
              :info="true"
              :name="data.name"
            >
            </SharedAvatar>
          </div>
          <Badge size="w-20" color="text-slate-800" background="bg-[#edf0f7]">
            <SharedIcon
              icon="check_circle"
              size="text-sm mr-1"
              color="text-black"
            >
            </SharedIcon>
            <span>
              {{
                dataStore.getMemberCount(dataStore.selected.taskID).length
              }}/{{ dataStore.selected.memberCount }}</span
            >
          </Badge>
        </div>
      </div>
      <div class="absolute top-2 right-3 text-black" @click="closeHandler">
        <SharedIcon icon="close" color="hover:text-red-900"> </SharedIcon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  @apply w-full h-full fixed top-0 z-50 left-0;
}

.modal__layer {
  @apply w-full h-full bg-black bg-opacity-20;
  backdrop-filter: blur(1px);
}
.modal__content {
  @apply w-[90%] h-2/5 md:h-[45%] lg:w-3/5 xl:w-2/5 lg:h-2/5 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]  bg-white rounded-xl shadow-xl flex justify-center items-center;
}
</style>
