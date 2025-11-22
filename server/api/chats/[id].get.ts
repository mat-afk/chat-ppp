import { ensureUserIsParticipantOfChat } from "~~/server/utils/query";
import { idSchema } from "~~/shared/lib/zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, idSchema.parse);

  const chat = await ensureUserIsParticipantOfChat(user, id);

  if (!chat) {
    throw createError({ statusCode: 404, message: "Chat não encontrado." });
  }

  return chat;
});
