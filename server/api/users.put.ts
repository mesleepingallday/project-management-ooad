//@ts-nocheck
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getRequestHeaders(event);
  const { userId } = getQuery(event);

  const data = await $fetch(`http://localhost:8080/users/${userId}`, {
    method: "PUT",
    headers,
    body,
  });
  return data;
});
