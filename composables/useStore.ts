const encodedUsername = localStorage.getItem("username");
const encodedPassword = localStorage.getItem("password");

// Decode the Base64 encoded username and password
const authUsername = atob(encodedUsername);
const authPassword = atob(encodedPassword);

export const addTask = async (
  title: string,
  description: string,
  status: string,
  priority: string
) => {
  const newTask = { title, description, status, priority };
  const data = await useFetch(`/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${authUsername}:${authPassword}`)}`,
    },
    body: newTask,
  });
  if (data.error.value) {
    throw new Error("Failed to create new task");
  }
  return data;
};

export const addUser = async ({
  username,
  fullName,
  email,
  role,
  password,
}: {
  username: string;
  fullName: string;
  email: string;
  role: string;
  password: string;
}) => {
  const newTask = { username, fullName, email, role, password };
  const data = await useFetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${authUsername}:${authPassword}`)}`,
    },
    body: newTask,
  });
  if (data.error.value) {
    throw new Error("Failed to create new user");
  }
  return data;
};

export const updateTask = async (
  taskId: string,
  status: string,
  title: string,
  description: string,
  priority: string
) => {
  const newTask = { title, description, status, priority };
  const data = await useFetch(`/api/tasks`, {
    query: { taskId },
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${authUsername}:${authPassword}`)}`,
    },
    body: newTask,
  });
  if (data.error.value) {
    throw new Error("Failed to update task");
  }
  return data;
};

export const updateUser = async (
  {
    username,
    fullName,
    email,
    role,
    password,
  }: {
    username: string;
    fullName: string;
    email: string;
    role: string;
    password: string;
  },
  userId: string
) => {
  const updatedUser = { username, fullName, email, role, password };
  const data = await useFetch(`/api/users`, {
    query: { userId },
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${authUsername}:${authPassword}`)}`,
    },
    body: updatedUser,
  });
  if (data.error.value) {
    throw new Error("Failed to update user");
  }
  return data;
};

export const getTaskDetails = (id: string) => {
  const dataStore = useDataStore();
  return dataStore.data.map((task: { taskId: string }) => {
    if (task?.taskId === id) {
      return task;
    }
  });
};

export const getCurrentUserDetails = async () => {
  const memberStore = useMemberStore();
  await memberStore.fetchUsers();
  let currentUser;
  memberStore?.users?.forEach((user: { username: string }) => {
    if (user.username === authUsername) {
      currentUser = user;
    }
  });
  return currentUser;
};

export const assignUserToTask = async (taskId: string, userId: string) => {
  const data = await useFetch(`/api/tasks/assign`, {
    query: { taskId, userId },
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${authUsername}:${authPassword}`)}`,
    },
  });
  if (data.error.value) {
    throw new Error("Failed to assign user to task");
  }
  return data;
};

export const getLastTaskId = async () => {
  const memberStore = useMemberStore();
  await memberStore.fetchAllTasks();
  const lastId = memberStore.allTasks?.length;
  console.log(lastId);
  return lastId;
};

export const checkManager = async () => {
  const currentUser = await getCurrentUserDetails();
  return currentUser?.role === "manager";
};
