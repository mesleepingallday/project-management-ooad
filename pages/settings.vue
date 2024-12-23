<script setup>
definePageMeta({
  layout: "content",
});
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { ref } from "vue";
const loadingInfo = ref(true);
const toast = useToast();
const route = useRouter();
const currentUser = ref({});
currentUser.value = await getCurrentUserDetails();
console.log(currentUser.value);
loadingInfo.value = false;

const inputs = ref([
  {
    label: "FullName",
    type: "text",
    value: currentUser.value?.fullName,
    placeholder: "Enter new full name",
  },
  {
    label: "Email",
    type: "text",
    value: currentUser.value?.email,
    placeholder: "Enter new email",
  },
  {
    label: "New Password",
    type: "password",
    value: currentUser.value?.password,
    placeholder: "Enter new password",
  },
]);

const handleUpdateUser = async () => {
  const fullName = inputs.value.find((item) => item.label == "FullName").value;
  const email = inputs.value.find((item) => item.label == "Email").value;
  const newPassword = inputs.value.find(
    (item) => item.label == "New Password"
  ).value;

  const data = {
    fullName: fullName,
    email: email,
    password: newPassword,
    username: currentUser.value.username,
    role: currentUser.value.role,
  };

  if (fullName && email && newPassword) {
    try {
      const authStore = useAuthStore();
      await updateUser(data, currentUser.value.userId);
      toast.add({
        severity: "success",
        summary: "User Info Updated",
        detail: "User info has been updated successfully, please re-login",
        life: 3000,
      });
      authStore.clearCredentials();
      setTimeout(() => {
        route.push("/login");
      }, 1500);
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while updating user info",
        life: 3000,
      });
    }
  }
};
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <Toast />
    <div
      :class="[
        'w-[95%] lg:w-3/5 min-h-[90%] max-h-full p-3 overflow-y-auto fixed bg-[#212121] rounded-2xl flex flex-col justify-center items-center text-white',
        { loadingInfo: loadingInfo },
      ]"
    >
      <h1 class="text-2xl text-center font-bold text-gray-200">
        Update user information
      </h1>
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
      <div class="w-[90%] lg:w-2/3 mt-5">
        <button
          @click="handleUpdateUser"
          class="w-full h-10 bg-blue-500 text-white rounded-md"
        >
          Update
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

.loadingInfo::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 999;
}
</style>
