<template>
  <div class="loginScreen">
    <Toast />
    <div class="card">
      <div class="flex flex-col gap-4 w-full p-4 sm:p-6 lg:p-10">
        <p class="font-bold text-2xl sm:text-3xl py-1">Sign in</p>
        <p class="font-semibold text-lg sm:text-xl py-1">
          Nice to see you again
        </p>
        <!-- Login Form -->
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          @submit="onLogin"
          class="flex flex-col gap-4 py-2"
        >
          <div class="flex flex-col">
            <InputText
              name="username"
              placeholder="Username"
              fluid
              class="w-full"
            />
            <div class="h-3">
              <Message
                v-if="$form.username?.invalid"
                severity="error"
                size="small"
                variant="simple"
                class="text-sm"
                >{{ $form.username?.error.message }}</Message
              >
            </div>
          </div>
          <div class="flex flex-col">
            <Password
              name="password"
              type="password"
              placeholder="Password"
              toggleMask
              :feedback="false"
              fluid
              class="w-full"
            />
            <div class="h-3">
              <Message
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
                class="text-sm"
                >{{ $form.password?.error.message }}</Message
              >
            </div>
          </div>

          <Button
            type="submit"
            severity="secondary"
            label="Login"
            class="w-full"
          />
          <Divider />

          <!-- Register -->
          <p class="text-center text-sm sm:text-base">
            Don't have an account?
            <NuxtLink to="/signup" class="text-blue-500 font-semibold"
              >Sign up</NuxtLink
            >
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
definePageMeta({
  title: "Login",
  description: "Login to your account",
  layout: "entry",
});

import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
const authStore = useAuthStore();
const memberStore = useMemberStore();
const toast = useToast();
const memberStore = useMemberStore();
const initialValues = ref({
  username: "",
  password: "",
});

const schema = z.object({
  username: z.string().min(1, "Username must not be empty."),
  password: z.string().min(1, "Password must not be empty."),
});

const resolver = zodResolver(schema);

const onLogin = async (e: any) => {
  if (e.valid) {
    const { username, password } = e.values;
    const credentials = { username, password };

    try {
      const data = await useFetch("/api/auth/login", {
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (data.error.value) {
        throw new Error(data.error.value);
      }
      const isManager = data.data.value.role === "manager";
      memberStore.setManager(isManager);
      toast.add({
        severity: "success",
        summary: "Login successful",
        detail: "Redirecting to your dashboard...",
        life: 3000,
      });
      setTimeout(() => {
        console.log("redirecting...");
        const encodedUsername = encodeBase64(username);
        const encodedPassword = encodeBase64(password);
        authStore.login(encodedUsername, encodedPassword);

        navigateTo("/", { external: true });
      }, 2000);
    } catch (error) {
      if (error.message.includes("500")) {
        toast.add({
          severity: "error",
          summary: "Fail to login in",
          detail: "Server error. Please try again later.",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Fail to login in",
          detail: "Username or password is incorrect.",
          life: 3000,
        });
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.loginScreen {
  @apply bg-[#0093e9] bg-gradient-to-r from-[#0093e9] to-[#80d0c7] min-h-screen w-full;
  @apply flex items-center justify-center p-4;
}

.card {
  @apply flex flex-col lg:flex-row bg-white rounded-lg shadow-lg;
  @apply w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px];
  @apply mx-4 my-8 sm:mx-6 sm:my-10 lg:mx-8;
}

:deep(.p-message) {
  margin: 0;
  padding: 0.2rem 0;
}

:deep(.p-message-wrapper) {
  padding: 0;
}
</style>
