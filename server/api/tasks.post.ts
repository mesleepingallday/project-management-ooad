//@ts-nocheck
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getRequestHeaders(event);

  const data = await $fetch(`http://localhost:8080/tasks`, {
    method: "POST",
    headers,
    body,
  });
  return data;
});
