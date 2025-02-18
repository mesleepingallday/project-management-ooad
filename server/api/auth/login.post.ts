export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await $fetch("http://localhost:8080/users/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  return user;
});
