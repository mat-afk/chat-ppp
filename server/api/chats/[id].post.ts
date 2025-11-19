import { Prisma, prisma } from "~~/server/lib/prisma";
import { idSchema, inputSchema } from "~~/shared/lib/zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);
  const { input } = await readValidatedBody(event, inputSchema.parse);

  const where: Prisma.ChatWhereUniqueInput = { id };

  if (user.type === "GUEST") where.guestId = user.id;
  else where.performerId = user.id;

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

  await prisma.message.create({
    data: { content: input, sender: user.type, chatId: chat.id },
  });

  const data: Prisma.ChatUncheckedUpdateInput = {
    lastMessageSender: user.type,
  };

  if (chat.status === "WAITING" && user.type === "PERFORMER") {
    data.performerId = user.id;
    data.assumedAt = new Date();
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

  return chat;
});
