import { connections } from "~~/server/global/clients";
import { prisma } from "~~/server/lib/prisma";
import { idSchema } from "~~/shared/lib/zod";
import { WebSocketData } from "~~/shared/types";

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

  const targetsIds = new Set<string>();

  if (chat.performerId) {
    targetsIds.add(chat.performerId);
  } else {
    const performers = await prisma.performer.findMany();

    for (const performer of performers) {
      targetsIds.add(performer.id);
    }
  }

  for (const targetId of targetsIds) {
    const peer = connections.get(targetId);

    if (peer) {
      const wsData: WebSocketData = {
        event: "chat-deleted",
        payload: chat,
      };

      peer.send(wsData);
    }
  }
});
