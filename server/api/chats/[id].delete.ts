import { connections } from "~~/server/global/clients";
import { eq, tables, useDrizzle } from "~~/server/utils/drizzle";
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

  const db = useDrizzle();

  const chat = await db.query.chats.findFirst({
    where: (table) => and(eq(table.id, id), eq(table.guestId, user.id)),
  });

  if (!chat) {
    throw createError({
      statusCode: 404,
      message: "Chat não encontrado.",
    });
  }

  await db.delete(tables.chats).where(eq(tables.chats.id, id));

  const targetsIds = new Set<string>();

  if (chat.performerId) {
    targetsIds.add(chat.performerId);
  } else {
    const performers = await db.query.performers.findMany();

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
