//@ts-nocheck
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getRequestHeaders(event);
  const { taskId } = getQuery(event);

  const data = await $fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "PUT",
    headers,
    body,
  });
  return data;
});
