import { connections } from "~~/server/global/clients";
import { tables, useDrizzle } from "~~/server/utils/drizzle";
import { inputSchema } from "~~/shared/lib/zod";
import { WebSocketData } from "~~/shared/types";

export default defineEventHandler(async (event) => {
  const { input } = await readValidatedBody(event, inputSchema.parse);

  const { user } = await requireUserSession(event);

  if (user.type === "PERFORMER") {
    throw createError({
      statusCode: 409,
      message: "Você não pode iniciar um chat como um performer.",
    });
  }

  const firts10Words = input.split(" ").splice(0, 10).join(" ");

  const db = useDrizzle();

  const [chat] = await db
    .insert(tables.chats)
    .values({
      title: firts10Words,
      guestId: user.id,
      lastMessageSender: "GUEST",
    })
    .returning();

  await db
    .insert(tables.messages)
    .values({ content: input, sender: "GUEST", chatId: chat.id });

  const targetsIds = new Set([user.id]);
  const performers = await db.query.performers.findMany();

  for (const performer of performers) {
    targetsIds.add(performer.id);
  }

  for (const targetId of targetsIds) {
    const peer = connections.get(targetId);

    if (peer) {
      const wsData: WebSocketData = {
        event: "new-chat",
        payload: chat,
      };

      peer.send(wsData);
    }
  }

  return chat;
});
