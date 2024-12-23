<script setup>
definePageMeta({
  layout: "content",
});
import { useToast } from "primevue/usetoast";
const memberStore = useMemberStore();
onMounted(async () => {
  const isManager = await checkManager();
  memberStore.setManager(isManager);
});
const toast = useToast();
const route = useRouter();

const dataStore = useDataStore();
const fetchMemberList = async () => {
  const memberStore = useMemberStore();
  await memberStore.fetchUsers();
  dataStore.user = memberStore.users;
  console.log(dataStore.user);
};
await fetchMemberList();
const selectedMembers = ref([]);
const inputs = ref([
  {
    label: "Title",
    type: "text",
    value: "",
    placeholder: "Enter title",
  },
  {
    label: "Description",
    type: "text",
    value: "",
    placeholder: "Enter description",
  },
  {
    label: "Date",
    type: "date",
    value: "",
    placeholder: "Enter date",
  },
]);

const member = ref({});
const priority = ref("High");

const handleAddTask = async () => {
  const title = inputs.value.filter((item) => item.label == "Title")[0].value;
  const description = inputs.value.filter(
    (item) => item.label == "Description"
  )[0].value;

  const data = {
    title: title,
    description: description,
    priority: priority.value,
    status: "Backlog",
    // member: member.value,
  };

  if (title && description) {
    await addTask(title, description, "Backlog", priority.value);
    const newTaskId = await getLastTaskId();
    if (selectedMembers.value.length > 0) {
      selectedMembers.value.forEach(async (item) => {
        console.log(item.userId);
        await assignUserToTask(newTaskId, item.userId);
      });
    }
    toast.add({
      severity: "success",
      summary: "Task Added",
      detail: "Task has been added successfully",
      life: 3000,
    });
    route.push("/tasks");
    member.value = {};
  }
};
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <Toast />
    <div
      class="w-[95%] lg:w-3/5 min-h-[90%] max-h-full p-3 overflow-y-auto fixed bg-[#212121] rounded-2xl flex flex-col justify-center items-center text-white"
    >
      <h1 class="text-2xl text-center font-bold text-gray-200">New Task</h1>
      <div
        v-for="(input, index) in inputs"
        :key="index"
        class="w-[90%] lg:w-2/3 mt-3 text-white"
      >
        <SharedInput
          v-model:value="input.value"
          :label="input.label"
          :type="input.type"
          :placeHolder="input.placeholder"
          :limit="input.limit"
          class="w-full p-2 mt-5 text-md bg-[#121212] rounded-lg"
        >
        </SharedInput>
      </div>

      <div class="w-[90%] lg:w-2/3 mt-2">
        <label for="priority" class="text-sm font-medium text-gray-400"
          >Priority</label
        >
        <select
          id="priority"
          v-model="priority"
          class="w-full text-gray-300 bg-[#121212] rounded-lg p-2"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div
        class="w-[90%] lg:w-2/3 flex flex-col mt-2"
        v-if="memberStore.isManager"
      >
        <label for="member" class="text-sm font-medium text-gray-400"
          >Member</label
        >
        <div class="card flex justify-center" id="member">
          <MultiSelect
            v-model="selectedMembers"
            :options="dataStore.user"
            optionLabel="fullName"
            filter
            placeholder="Select Members"
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="w-[90%] lg:w-2/3 mt-5">
        <button
          @click="handleAddTask"
          class="w-full h-10 bg-blue-500 text-white rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.date::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.scroll-bar::-webkit-scrollbar {
  width: 6px;
}

.scroll-bar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.scroll-bar::-webkit-scrollbar-thumb {
  background-color: #393e46;
  outline: 1px solid #121212;
  border-radius: 20px;
}
</style>
