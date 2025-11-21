import { connections } from "~~/server/global/clients";
import { Prisma, prisma } from "~~/server/lib/prisma";
import { idSchema, inputSchema } from "~~/shared/lib/zod";
import { WebSocketData } from "~~/shared/types";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);
  const { input } = await readValidatedBody(event, inputSchema.parse);

  const where: Prisma.ChatWhereUniqueInput = { id };

  if (user.type === "GUEST") {
    where.guestId = user.id;
  } else {
    where.OR = [{ performerId: user.id }, { performerId: null }];
  }

  let chat = await prisma.chat.findUnique({
    where,
  });

  if (!chat) {
    throw createError({ statusCode: 404, message: "Chat não encontrado." });
  }

  if (chat.lastMessageSender === user.type) {
    throw createError({
      statusCode: 409,
      message: "Você precisa esperar a resposta do outro participante.",
    });
  }

  const message = await prisma.message.create({
    data: { content: input, sender: user.type, chatId: chat.id },
  });

  const data: Prisma.ChatUncheckedUpdateInput = {
    lastMessageSender: user.type,
    updatedAt: new Date(),
  };

  if (chat.status === "WAITING" && user.type === "PERFORMER") {
    data.performerId = user.id;
    data.assumedAt = new Date();
    data.status = "IN_PROGRESS";
  }

  chat = await prisma.chat.update({
    data: data,
    where: { id: chat.id },
    include: { messages: { orderBy: { sentAt: "asc" } } },
  });

  if (!chat) {
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
