<template>
  <div>
    <Toast />
    <Card class="h-full w-full ml-8">
      <template #header>
        <div class="flex justify-end mt-5 mr-5">
          <Button @click="visibleCreateModal = true">New Users</Button>
        </div>
      </template>
      <template #content>
        <DataTable
          v-model:editingRows="editingRows"
          :value="users"
          editMode="row"
          dataKey="userId"
          @row-edit-save="onRowEditSave"
          paginator
          sortField="userId"
          :sortOrder="-1"
          rows="9"
          scrollable
          scrollHeight="550px"
          class="w-full"
        >
          <Column field="username" header="Username" style="width: 20%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column field="fullName" header="Full Name" style="width: 20%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column field="role" header="Role" style="width: 20%">
            <template #editor="{ data, field }">
              <Select
                v-model="data[field]"
                :options="roles"
                optionLabel="label"
                optionValue="value"
                placeholder="Select a Role"
                fluid
              >
                <template #option="slotProps">
                  <Tag
                    :value="slotProps.option.value"
                    :severity="getRoleLabel(slotProps.option.value)"
                  />
                </template>
              </Select>
            </template>
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.role"
                :severity="getRoleLabel(slotProps.data.role)"
              />
            </template>
          </Column>
          <Column field="email" header="Email" style="width: 20%">
            <template #body="{ data, field }">
              {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
          <Column
            :rowEditor="true"
            style="width: 10%; min-width: 8rem"
            bodyStyle="text-align:center"
          ></Column>
        </DataTable>
      </template>
    </Card>
    <!--Create new User Modal-->
    <Dialog
      v-model:visible="visibleCreateModal"
      modal
      header="Create New User"
      class="w-96"
    >
      <Form @submit="handleCreateUser" class="flex flex-col gap-4 w-full">
        <span class="text-surface-500 dark:text-surface-400 block mb-8"
          >Fill new user's information.</span
        >
        <div class="flex flex-col gap-1">
          <label for="fullName" class="font-semibold w-24">Full name</label>
          <InputText
            id="fullName"
            v-model="formData.fullName"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="email" class="font-semibold w-24">Email</label>
          <InputText
            id="email"
            v-model="formData.email"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="username" class="font-semibold w-24">Username</label>
          <InputText
            id="username"
            v-model="formData.username"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="font-semibold w-24">Password</label>
          <Password
            id="password"
            v-model="formData.password"
            autocomplete="off"
            class="flex-auto"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="role" class="font-semibold w-24">Role</label>
          <Select
            id="role"
            v-model="formData.role"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a role"
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
          <Button type="submit" label="Create"></Button>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "content",
});
const memberStore = useMemberStore();
const users = ref();
const fetchUsersData = async () => {
  await memberStore.fetchUsers();
  users.value = memberStore?.users;
};
await fetchUsersData();
const editingRows = ref([]);
const roles = ref([
  { label: "Member", value: "member" },
  { label: "Manager", value: "manager" },
]);
const toast = useToast();
const visibleCreateModal = ref(false);
const formData = reactive({
  username: "",
  fullName: "",
  role: "",
  email: "",
  password: "",
});
const handleCreateUser = async () => {
  try {
    await addUser(formData);
    toast.add({
      severity: "success",
      summary: "User Added",
      detail: "User has been added successfully",
      life: 3000,
    });
    await fetchUsersData();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add user",
      life: 3000,
    });
  } finally {
    visibleCreateModal.value = false;
  }
};

const onRowEditSave = (event) => {
  let { newData, index } = event;

  users.value[index] = newData;
};
const getRoleLabel = (role) => {
  switch (role) {
    case "member":
      return "success";
    case "manager":
      return "info";

    default:
      return null;
  }
};
</script>
