import { defineStore } from "pinia";

export const useMemberStore = defineStore({
  id: "memberStore",
  state: () => ({
    isLoading: false,
    error: null,
    personalTasks: [],
    allTasks: [],
    users: [],
    groups: [],
    isManager: false,
  }),
  actions: {
    setManager(isManager: boolean) {
      this.isManager = isManager;
    },
    async fetchPersonalTasks() {
      this.isLoading = true;
      this.error = null;

      try {
        const encodedUsername = localStorage.getItem("username");
        const encodedPassword = localStorage.getItem("password");
        if (!encodedUsername || !encodedPassword) {
          throw new Error("Username or password not found in localStorage");
        }

        // Decode the Base64 encoded username and password
        const username = atob(encodedUsername);
        const password = atob(encodedPassword);

        const { data } = await useFetch("/api/tasks/personal", {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        console.log(data);
        this.personalTasks = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAllTasks() {
      this.isLoading = true;
      this.error = null;

      try {
        const encodedUsername = localStorage.getItem("username");
        const encodedPassword = localStorage.getItem("password");
        if (!encodedUsername || !encodedPassword) {
          throw new Error("Username or password not found in localStorage");
        }

        // Decode the Base64 encoded username and password
        const username = atob(encodedUsername);
        const password = atob(encodedPassword);

        const { data } = await useFetch("/api/tasks/all", {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        console.log(data);
        this.allTasks = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchUsers() {
      this.isLoading = true;
      this.error = null;

      try {
        const encodedUsername = localStorage.getItem("username");
        const encodedPassword = localStorage.getItem("password");
        if (!encodedUsername || !encodedPassword) {
          throw new Error("Username or password not found in localStorage");
        }

        // Decode the Base64 encoded username and password
        const username = atob(encodedUsername);
        const password = atob(encodedPassword);

        const { data } = await useFetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        this.users = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchGroups() {
      this.isLoading = true;
      this.error = null;

      try {
        const encodedUsername = localStorage.getItem("username");
        const encodedPassword = localStorage.getItem("password");
        if (!encodedUsername || !encodedPassword) {
          throw new Error("Username or password not found in localStorage");
        }

        // Decode the Base64 encoded username and password
        const username = atob(encodedUsername);
        const password = atob(encodedPassword);

        const { data } = await useFetch("/api/groups", {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        this.groups = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
