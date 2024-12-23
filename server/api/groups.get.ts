export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, "Authorization");
  const data = await $fetch("http://localhost:8080/groups", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
  });
  return data;
});
