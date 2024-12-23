export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, "Authorization");
  console.log("hello");
  const data = await $fetch("http://localhost:8080/tasks/personal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
  return data;
});
