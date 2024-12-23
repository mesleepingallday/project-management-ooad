<script setup>
const dataStore = useDataStore();

const props = defineProps(["item", "status", "isDragItem"]);
const emit = defineEmits(["task-updated"]);
const toast = useToast();

const isDragActive = ref(false);

const dragActiveHandler = () => {
  isDragActive.value = !isDragActive.value;
};

const dragLeaveHandler = () => {
  isDragActive.value = false;
};

//Update task handler
const visibleTaskEditModal = ref(false);
const priorities = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];
const formData = reactive({
  title: props.item.title,
  description: props.item.description,
  priority: props.item.priority,
  status: props.item.status,
});
const taskID = props.item.taskId;
const handleEditTask = async () => {
  try {
    const { title, description, priority, status } = formData;
    await updateTask(taskID, status, title, description, priority);
    toast.add({
      severity: "success",
      summary: "Task Updated",
      detail: "Task has been updated successfully",
      life: 3000,
    });
    emit("task-updated");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update task",
      life: 3000,
    });
  } finally {
    visibleTaskEditModal.value = false;
  }
};

watchEffect(async () => {
  await updateTask(
    props.item.taskId,
    props.item.status,
    props.item.title,
    props.item.description,
    props.item.priority
  );
});

const modalHandler = () => {
  dataStore.setModalChange();
  dataStore.setSelectedData(props.item);
};
</script>

<template>
  <div
    class="w-full bg-[#212121] border border-[#121212] py-2 px-3 my-2 rounded-xl text-white shadow-xl hover:bg-[#121212] hover:border-[#212121] cursor-pointer relative"
    :draggable="isDragItem"
    @dragstart="dataStore.StartDragData($event, props.item)"
    @dragenter.prevent="dragActiveHandler"
    @dragend.prevent="dragLeaveHandler"
    :class="{ active: isDragActive }"
  >
    <div class="w-full h-8 flex justify-between items-center">
      <CustomBadge
        size="w-12"
        :text="props.item.priority"
        :color="props.item.priority"
        :background="props.item.priority"
      >
      </CustomBadge>

      <CustomBadge
        size="xl:w-18 2xl:w-20"
        :text="formatDate(props.item.createdAt)"
        color="text-black"
        background="bg-[#edf0f7]"
      >
      </CustomBadge>
    </div>
    <div class="w-full h-12 my-2 py-1">
      <h1 class="text-sm font-bold text-gray-200">
        {{ props.item.title }}
      </h1>
      <p class="text-xs truncate text-gray-300">
        {{ props.item.description }}
      </p>
    </div>
    <div class="w-full h-8 flex justify-between items-center">
      <SharedButton
        text="Inspect"
        :handler="modalHandler"
        class="w-14 p-1 rounded-md text-xs bg-[#edf0f7] text-black hover:bg-[#2d2d2d] hover:text-white"
      >
      </SharedButton>
      <Button
        label="Edit"
        @click="visibleTaskEditModal = true"
        class="w-14 p-1 rounded-md text-xs bg-[#edf0f7] text-black hover:bg-[#2d2d2d] hover:text-white"
      >
      </Button>
    </div>
    <TaskDone v-if="props.statu === 'Completed'"> </TaskDone>

    <!-- Edit task-->
    <Dialog
      v-model:visible="visibleTaskEditModal"
      modal
      header="Edit Task"
      class="w-96"
    >
      <Form @submit="handleEditTask" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1">
          <label for="title" class="font-semibold w-24">Title</label>
          <InputText
            id="title"
            v-model="formData.title"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="description" class="font-semibold w-24"
            >Description</label
          >
          <InputText
            id="description"
            v-model="formData.description"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="priority" class="font-semibold w-24">Priority</label>
          <Select
            id="priority"
            v-model="formData.priority"
            :options="priorities"
            optionLabel="label"
            optionValue="value"
            placeholder="Change priority"
            class="flex-auto"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visibleCreateModal = false"
          ></Button>
          <Button type="submit" label="Edit"></Button>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<style scoped>
.active {
  border: 2px dashed whitesmoke;
  background-color: #323644;
}

.High {
  background-color: #e09696;
  color: #4a0e0e;
}

.Medium {
  background-color: #e5d386;
  color: #584e24;
}
.Low {
  background-color: #94d594;
  color: #265526;
}

.Backlog {
  background-color: #5293ee;
}
</style>
