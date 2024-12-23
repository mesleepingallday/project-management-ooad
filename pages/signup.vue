<template>
  <div class="loginScreen">
    <Toast />
    <div class="card">
      <div class="loginCard">
        <UiLogo class="w-32 sm:w-40" />
        <p class="font-bold text-2xl sm:text-3xl py-1">Sign up</p>
        <p class="font-semibold text-lg sm:text-xl py-1">Nice to meet you</p>
        <!-- Login Form -->
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          @submit="onSignUp"
          class="flex flex-col gap-4 py-2"
        >
          <div class="flex flex-col gap-1">
            <InputText
              name="email"
              type="text"
              placeholder="Email"
              fluid
              class="w-full"
            />
            <div class="h-2">
              <Message
                v-if="$form.email?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.email?.error.message }}</Message
              >
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              name="fullName"
              type="text"
              placeholder="Full Name"
              fluid
              class="w-full"
            />
            <div class="h-2">
              <Message
                v-if="$form.fullName?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.fullName?.error.message }}</Message
              >
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <InputText
              name="username"
              type="text"
              placeholder="Username"
              fluid
              class="w-full"
            />
            <div class="h-2">
              <Message
                v-if="$form.username?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.username?.error.message }}</Message
              >
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <Password
              name="password"
              type="password"
              placeholder="Password"
              toggleMask
              feedback
              fluid
              class="w-full"
            />
            <div class="h-2">
              <Message
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.password?.error.message }}</Message
              >
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <Password
              name="confirm_password"
              type="password"
              placeholder="Confirm password"
              toggleMask
              :feedback="false"
              fluid
              class="w-full"
            />
            <div class="h-1">
              <Message
                v-if="$form.confirm_password?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.confirm_password?.error.message }}</Message
              >
            </div>
          </div>
          <Button
            type="submit"
            severity="secondary"
            label="Sign up"
            class="w-full"
          />
          <Divider />

          <!-- Register -->
          <p class="text-center text-sm sm:text-base">
            Already have an account?
            <NuxtLink to="/login" class="text-blue-500 font-semibold"
              >Sign in</NuxtLink
            >
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Sign up",
  description: "Sign up a new account",
});

import { zodResolver } from "@primevue/forms/resolvers/zod";

import { z } from "zod";

const toast = useToast();
const initialValues = ref({
  email: "",
  name: "",
  password: "",
  confirm_password: "",
});

const schema = z
  .object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(1, "Password must be filled."),
    username: z.string().min(1, "Username must be required."),
    fullName: z.string().min(1, "Fullname must be required."),
    confirm_password: z.string(),
  })

  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

const resolver = zodResolver(schema);

const onSignUp = async (e) => {
  if (e.valid) {
    const { email, username, fullName, password, confirm_password } = e.values;
    const credentials = {
      email,
      username,
      fullName,
      password,
      confirm_password,
    };
    try {
      const data = await useFetch("/api/auth/signup", {
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (data.error.value) {
        throw new Error(data.error.value);
      }
      toast.add({
        severity: "success",
        summary: "Sign up successful",
        detail: "Redirecting to login page...",
        life: 3000,
      });
      setTimeout(() => {
        navigateTo("/login");
      }, 1500);
    } catch (error) {
      if (error.message.includes("500")) {
        toast.add({
          severity: "error",
          summary: "Fail to sign up",
          detail: "Server error. Please try again later.",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Fail to sign up",
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
  @apply bg-[#0093e9] bg-gradient-to-r from-[#0093e9] to-[#80d0c7];
  @apply min-h-screen w-full flex items-center justify-center p-4;
}

.card {
  @apply flex flex-col lg:flex-row bg-white rounded-lg shadow-lg;
  @apply w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[900px];
  @apply mx-4 my-8 sm:mx-6 sm:my-10 lg:mx-8;
}

.loginCard {
  @apply flex flex-col gap-4;
  @apply w-full p-4 sm:p-6 lg:p-10;
}
</style>
