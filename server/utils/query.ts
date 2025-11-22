import { User } from "#auth-utils";

export async function ensureUserIsParticipantOfChat(
  user: User,
  chatId: string
) {
  const db = useDrizzle();

  return await db.query.chats.findFirst({
    where: (table) =>
      user.type === "GUEST"
        ? and(eq(table.id, chatId), eq(table.guestId, user.id))
        : and(
            eq(table.id, chatId),
            or(eq(table.performerId, user.id), isNull(table.performerId))
          ),
    with: {
      messages: { orderBy: (messages, { asc }) => [asc(messages.sentAt)] },
    },
  });
}
