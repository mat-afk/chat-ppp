import { prisma } from "~~/server/lib/prisma";
import { idSchema } from "~~/server/lib/zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);

  if (user.type === "PERFORMER") {
    throw createError({
      statusCode: 403,
      message: "Você não pode deletar um chat como performer.",
    });
  }

  const chat = await prisma.chat.findUnique({ where: { id } });

  if (!chat) {
    throw createError({
      statusCode: 404,
      message: "Chat não encontrado.",
    });
  }

  await prisma.message.deleteMany({ where: { chatId: chat.id } });
  await prisma.chat.delete({ where: { id } });
});
