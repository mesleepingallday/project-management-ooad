import { defineStore } from "pinia";

interface AuthState {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    username: "",
    password: "",
  }),
  actions: {
    login(encodedUsername: string, encodedPassword: string) {
      const username = atob(encodedUsername);
      const password = atob(encodedPassword);

      this.username = username;
      this.password = password;

      // Store Base64-encoded values in localStorage
      localStorage.setItem("username", encodedUsername);
      localStorage.setItem("password", encodedPassword);
    },
    loadFromLocalStorage() {
      const encodedUsername = localStorage.getItem("username") ?? "";
      const encodedPassword = localStorage.getItem("password") ?? "";

      if (encodedUsername && encodedPassword) {
        this.username = atob(encodedUsername);
        this.password = atob(encodedPassword);
      }
    },
    clearCredentials() {
      this.username = "";
      this.password = "";
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    },
  },
});
