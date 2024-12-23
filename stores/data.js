import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: [],
    data: [],
    currentUser: null,
    selected: "",
    isModalActive: false,
    notifications: [],
    activity: [],
  }),
  actions: {
    setActivity(activity) {
      this.activity.unshift(activity);
    },
    updateProfilePhoto(photo) {
      this.currentUser.image = photo;
      this.user.filter(
        (user) => user.userID === this.currentUser.userID
      )[0].image = photo;
    },
    setNotifications(notifications) {
      this.notifications.push(notifications);
    },
    removeNotifications(id) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id
      );
    },
    setSelectedData(data) {
      this.selected = data;
    },
    setCurrentUser(user) {
      this.currentUser = user;
    },
    getData(statu) {
      return this.data.filter((item) => item?.status === statu);
    },
    StartDragData(event, item) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("id", item.taskId);
    },
    async DropData(event, statu) {
      const itemID = event.dataTransfer.getData("id");
      const pickedItem = this.data.find(
        (item) => item.taskId === Number(itemID)
      );
      this.data = this.data.map((item) =>
        item.taskId === Number(itemID) ? { ...item, status: statu } : item
      );
    },
    setModalChange() {
      this.isModalActive = !this.isModalActive;
    },
    setUserToData(id) {
      this.data = this.data.map((item) => {
        item.member = this.user.reduce(
          (acc, cur) => {
            if (!item.member[cur.userID]) {
              acc[cur.userID] = {
                name: cur.name,
                statu: "Backlog",
              };
            }
            return acc;
          },
          { ...item.member }
        );
        return item;
      });
    },
    setUser(user) {
      //
      this.user.push(user);
    },
    addTask(data) {
      //
      this.data.push(data);
    },
    setTasks(data) {
      this.data = [];
      this.data = data;
    },
    setFavorite(id) {
      const index = this.data.findIndex((item) => item.id === id);
      this.data[index].isFavorite = !this.data[index].isFavorite;
    },
    clearData() {
      this.data = [];
      this.user = [];
      this.selected = "";
      this.activity = [];
    },
    clearTasks() {
      this.data = [];
    },
    getPoint(id) {
      return this.data
        .filter((item) => item.member[id]?.statu === "Done")
        .reduce((a, b) => a + b.point, 0);
    },
    getMemberCount(id) {
      const countMember = this.data.find((item) => item.taskID === id).member;
      const memberValues = Object.values(countMember);
      const member = memberValues.filter((item) => item.statu !== "Backlog");
      return member;
    },
    getCompletedTask() {
      return this.data?.filter((item) => item.status === "Completed").length;
    },
    getNotCompletedTask() {
      return this.data?.filter((item) => item.status !== "Completed").length;
    },
    getTaskByStatus(name) {
      return this.data?.filter((item) => item?.status === name).length;
    },
  },
});
