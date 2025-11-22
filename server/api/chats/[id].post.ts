import { connections } from "~~/server/global/clients";
import { Chat, eq, tables, useDrizzle } from "~~/server/utils/drizzle";
import { ensureUserIsParticipantOfChat } from "~~/server/utils/query";
import { idSchema, inputSchema } from "~~/shared/lib/zod";
import { WebSocketData } from "~~/shared/types";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);
  const { input } = await readValidatedBody(event, inputSchema.parse);

  const db = useDrizzle();

  let chat = await ensureUserIsParticipantOfChat(user, id);

  if (!chat) {
    throw createError({ statusCode: 404, message: "Chat não encontrado." });
  }

  if (chat.lastMessageSender === user.type) {
    throw createError({
      statusCode: 409,
      message: "Você precisa esperar a resposta do outro participante.",
    });
  }

  const [message] = await db
    .insert(tables.messages)
    .values({ content: input, sender: user.type, chatId: chat.id })
    .returning();

  const data: Partial<Chat> = {
    lastMessageSender: user.type,
    updatedAt: new Date(),
  };

  if (chat.status === "WAITING" && user.type === "PERFORMER") {
    data.performerId = user.id;
    data.assumedAt = new Date();
    data.status = "IN_PROGRESS";
  }

  const [updatedChat] = await db
    .update(tables.chats)
    .set(data)
    .where(eq(tables.chats.id, id))
    .returning();

  if (!updatedChat) {
    throw createError({
      statusCode: 500,
      message: "Erro no servidor.",
    });
  }

  const receiverId = user.type === "GUEST" ? chat.performerId : chat.guestId;

  if (!receiverId) {
    return chat;
  }

  const peer = connections.get(receiverId);

  if (peer) {
    const wsData: WebSocketData = {
      event: "new-message",
      payload: message,
    };
    peer.send(wsData);
  }

  return chat;
});
