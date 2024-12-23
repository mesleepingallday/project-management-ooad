//@ts-nocheck
export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, "Authorization");
  const { taskId, userId } = getQuery(event);

  const data = await $fetch(
    `http://localhost:8080/tasks/${taskId}/assign/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    }
  );
  return data;
});
