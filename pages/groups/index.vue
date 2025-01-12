<template>
  <div>
    <Toast />
    <Card>
      <template #header>
        <div v-if="isManager" class="flex justify-end mt-5 mr-5">
          <Button @click="visibleCreateModal = true">New Groups</Button>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="groups"
          rowGroupMode="rowspan"
          groupRowsBy="groupName"
          :sortOrder="-1"
          sortField="groupId"
          paginator
          :rows="4"
          scrollable
          scrollHeight="800px"
          tableStyle="custom-container"
        >
          <Column header="#" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column
            field="groupName"
            header="Group Name"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.data.groupName }}</span>
              </div>
            </template>
          </Column>
          <Column header="Members" style="min-width: 200px">
            <template #body="slotProps">
              <div
                v-for="(member, index) in slotProps.data.members"
                :key="index"
              >
                <span>{{ member.fullName || "Unknown Member" }}</span>
              </div>
            </template>
          </Column>
          <Column header="Task title" style="min-width: 200px">
            <template #body="slotProps">
              <div
                v-for="(item, index) in slotProps.data.groupTasks"
                :key="index"
              >
                <span>{{ item?.title || "Unknown Member" }}</span>
              </div>
            </template>
          </Column>
          <Column
            field="groupTasks"
            header="Description"
            style="min-width: 200px"
          >
            <template #body="slotProps">
              <div
                v-for="(item, index) in slotProps.data.groupTasks"
                :key="index"
              >
                <span>{{ item?.description || "Unknown Tasks" }}</span>
              </div>
            </template>
          </Column>
          <Column header="Status" style="min-width: 100px">
            <template #body="slotProps">
              <div
                v-for="(item, index) in slotProps.data.groupTasks"
                :key="index"
              >
                <Tag
                  @click="displayStatus($event, item)"
                  :value="item?.status"
                  :severity="getSeverity(item?.status)"
                />
              </div>
            </template>
          </Column>
          <Column v-if="isManager" class="w-24 !text-end">
            <template #body="slotProps">
              <Icon
                name="gridicons:user-add"
                @click="handleSelectGroupMember(slotProps.data)"
                size="1em"
                class="cursor-pointer"
              >
              </Icon>
              <Icon
                name="tdesign:task-add-filled"
                @click="handleSelectGroupTask(slotProps.data)"
                size="1em"
                class="cursor-pointer ml-2"
              >
              </Icon>
              <Icon
                name="material-symbols:person-remove"
                @click="handleSelectGroupTask(slotProps.data)"
                size="1em"
                class="cursor-pointer ml-2"
              >
              </Icon>
            </template>
          </Column>
        </DataTable>

        <!--Switch Status Popover-->
        <Popover ref="op">
          <div class="flex flex-col gap-4">
            <div>
              <ul class="list-none p-0 m-0 flex flex-col">
                <li
                  v-for="status in statuses.filter(
                    (s) => s.value !== selectedTask.status
                  )"
                  :key="status.name"
                  class="flex items-center gap-2 px-2 py-3 hover:bg-emphasis cursor-pointer rounded-border"
                  @click="selectStatus(item, status.value)"
                >
                  <div>
                    <span class="font-medium">{{ status.name }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Popover>
      </template>
    </Card>
    <!--Create new Group Modal-->
    <Dialog
      v-model:visible="visibleCreateModal"
      modal
      header="Create New Group"
      class="w-96"
    >
      <Form @submit="handleCreateGroup" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1">
          <label for="groupName" class="font-semibold w-24">Group name</label>
          <InputText
            id="groupName"
            v-model="formData.groupName"
            class="flex-auto"
            autocomplete="off"
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visibleCreateModal = false"
          ></Button>
          <Button type="submit" label="Create"></Button>
        </div>
      </Form>
    </Dialog>

    <!--Add Member to Group Modal-->
    <Dialog
      v-model:visible="visibleAddModal"
      modal
      header="Add New Group"
      class="w-96"
    >
      <Form @submit="handleAddMember" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1">
          <label for="memberName" class="font-semibold w-24">Member</label>
          <MultiSelect
            id="memberName"
            v-model="selectedMembers"
            :options="dataStore.user"
            optionLabel="fullName"
            filter
            placeholder="Select Members"
            class="w-full md:w-80"
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visibleAddModal = false"
          ></Button>
          <Button type="submit" label="Add Member"></Button>
        </div>
      </Form>
    </Dialog>

    <!--Add Task to Group Modal-->
    <Dialog
      v-model:visible="visibleAddModalT"
      modal
      header="Add Task To Group"
      class="w-96"
    >
      <Form @submit="handleAddTask" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1">
          <label for="title" class="font-semibold w-24">Title</label>
          <InputText
            id="title"
            v-model="formTaskData.title"
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
            v-model="formTaskData.description"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="status" class="font-semibold w-24">Status</label>
          <Select
            v-model="formTaskData.status"
            :options="statuses"
            optionLabel="name"
            optionValue="value"
            placeholder="Select task status"
            class="w-full md:w-56"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="priority" class="font-semibold w-24">Priority</label>
          <Select
            v-model="formTaskData.priority"
            :options="priorities"
            optionLabel="name"
            optionValue="value"
            placeholder="Select task priority"
            class="w-full md:w-56"
          />
        </div>

        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visibleAddModalT = false"
          ></Button>
          <Button type="submit" label="Add Tasks"></Button>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "content",
});
import { ref } from "vue";
const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};
const selectedTask = ref({});
const displayStatus = (event, task) => {
  op.value.toggle(event);
  selectedTask.value = task;
};
const selectStatus = async (task, status) => {
  const { taskId, title, description, priority } = selectedTask.value;
  try {
    await updateTask(taskId, status, title, description, priority);
    toast.add({
      severity: "success",
      summary: "Status Updated",
      detail: "Task status has been updated successfully",
      life: 3000,
    });
    await fetchGroupsData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update task status",
      life: 3000,
    });
  } finally {
    op.value.hide();
  }
};

const memberStore = useMemberStore();
const isManager = memberStore.isManager;
const groups = ref();
const selectedGroup = ref({});
const selectedPriority = ref();
const statuses = ref([
  { name: "Backlog", value: "Backlog" },
  { name: "Pending", value: "Pending" },
  { name: "In Progress", value: "In Progress" },
  { name: "Completed", value: "Completed" },
]);
const priorities = ref([
  { name: "High", value: "High" },
  { name: "Medium", value: "Medium" },
  { name: "Low", value: "Low" },
]);
const formTaskData = reactive({
  title: "",
  description: "",
  status: "",
  priority: "",
});

const dataStore = useDataStore();
const fetchMemberList = async () => {
  const memberStore = useMemberStore();
  await memberStore.fetchUsers();
  dataStore.user = memberStore.users;
};
await fetchMemberList();
const handleSelectGroupMember = (group) => {
  selectedGroup.value = group;
  visibleAddModal.value = true;
};
const fetchTaskList = async () => {
  const memberStore = useMemberStore();
  await memberStore.fetchAllTasks();
  dataStore.data = memberStore.allTasks;
};
await fetchTaskList();
const handleSelectGroupTask = (group) => {
  selectedGroup.value = group;
  visibleAddModalT.value = true;
};
const handleAddMember = async () => {
  try {
    const { groupId } = selectedGroup.value;
    if (selectedMembers.value.length > 0) {
      selectedMembers.value.forEach(async (item) => {
        await addMemberToGroup(groupId, item.userId);
      });
    }
    toast.add({
      severity: "success",
      summary: "Members Added",
      detail: "Members has been added successfully",
      life: 3000,
    });
    await fetchGroupsData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add member",
      life: 3000,
    });
  } finally {
    visibleAddModal.value = false;
  }
};
const handleAddTask = async () => {
  try {
    const { groupId } = selectedGroup.value;
    await addTaskToGroup(groupId, formTaskData);
    toast.add({
      severity: "success",
      summary: "Tasks Added",
      detail: "Tasks has been added successfully",
      life: 3000,
    });
    await fetchGroupsData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add tasks",
      life: 3000,
    });
  } finally {
    visibleAddModalT.value = false;
  }
};

const fetchGroupsData = async () => {
  await memberStore.fetchGroups();
  groups.value = memberStore?.groups;
};
await fetchGroupsData();

const toast = useToast();
const visibleCreateModal = ref(false);
const visibleAddModal = ref(false);
const visibleAddModalT = ref(false);
const selectedMembers = ref([]);

const formData = reactive({
  groupName: "",
});
const handleCreateGroup = async () => {
  try {
    const { groupName } = formData;
    await addGroup(groupName);
    toast.add({
      severity: "success",
      summary: "Group Added",
      detail: "Group has been added successfully",
      life: 3000,
    });
    await fetchGroupsData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add group",
      life: 3000,
    });
  } finally {
    visibleCreateModal.value = false;
  }
};
const getSeverity = (status) => {
  switch (status) {
    case "Backlog":
      return "danger";

    case "Pending":
      return "warn";

    case "In Progress":
      return "secondary";

    case "Completed":
      return "success";

    default:
      return null;
  }
};
</script>

<style scoped>
.custom-container {
  width: 95%;
  min-height: 90%;
  max-height: 100%;
  padding: 0.75rem;
  overflow-y: auto;
  position: fixed;
  background-color: #212121;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

@media (min-width: 1024px) {
  .custom-container {
    width: 60%;
  }
}
</style>
