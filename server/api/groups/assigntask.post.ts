//@ts-nocheck
export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);
  const body = await readBody(event);
  const { groupId } = getQuery(event);

  const data = await $fetch(`http://localhost:8080/groups/${groupId}/tasks`, {
    method: "POST",
    headers,
    body,
  });
  return data;
});
