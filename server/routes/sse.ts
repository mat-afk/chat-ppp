import { clients } from "../global/clients";

export default defineEventHandler(async (event) => {
  const { userId, chatId } = getQuery(event);

  console.log("[sse] connected " + userId);

  const eventStream = createEventStream(event);

  const existingClient = clients.get(userId as string);

  if (existingClient) {
    clients.set(
      userId as string,
      existingClient.set(chatId as string, eventStream)
    );
  } else {
    clients.set(userId as string, new Map([[chatId as string, eventStream]]));
  }

  return eventStream.send();
});
