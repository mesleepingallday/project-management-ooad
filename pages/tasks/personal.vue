<template>
  <div>
    <h1>Hello World</h1>
    <Button @click="fetchPersonalTasks">Fetch personal tasks</Button>
  </div>
</template>

<script lang="ts" setup>
import { useMemberStore } from "@/stores/memberStore";

definePageMeta({
  layout: "user",
});

const memberStore = useMemberStore();
const personalTasks = ref([]);

const fetchPersonalTasks = async () => {
  await memberStore.fetchPersonalTasks();
  personalTasks.value = memberStore.personalTasks;
};
</script>
