import { prisma, Prisma } from "~~/server/lib/prisma";
import { idSchema } from "~~/server/lib/zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);

  const where: Prisma.ChatWhereUniqueInput = { id };

  if (user.type === "GUEST") where.guestId = user.id;
  else where.OR = [{ performerId: user.id }, { performerId: null }];

  const chat = await prisma.chat.findUnique({
    where,
    include: { messages: { orderBy: { sentAt: "asc" } } },
  });

  if (!chat) {
    throw createError({ statusCode: 404, message: "Chat não encontrado." });
  }

  return chat;
});
