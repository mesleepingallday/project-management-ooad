<template>
  <div>
    <Toast />
    <Card class="my-app-dark">
      <template #header>
        <div class="flex justify-end mt-5 mr-5">
          <Button @click="visibleCreateModal = true">New Groups</Button>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="groups"
          dataKey="groupId"
          paginator
          sortField="groupId"
          :sortOrder="-1"
          rows="9"
        >
          <Column field="groupName" header="Group Name" style="width: 20%">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" fluid />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    <!--Create new User Modal-->
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
  </div>
</template>

<script setup>
definePageMeta({
  layout: "content",
});
const memberStore = useMemberStore();
const groups = ref();
const fetchGroupsData = async () => {
  await memberStore.fetchGroups();
  groups.value = memberStore?.groups;
};
await fetchGroupsData();

const toast = useToast();
const visibleCreateModal = ref(false);
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
</script>
