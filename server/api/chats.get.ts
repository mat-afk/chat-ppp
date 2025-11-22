import { eq, isNull, or, useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const db = useDrizzle();

  if (user.type === "GUEST") {
    return await db.query.chats.findMany({
      where: ({ guestId }) => eq(guestId, user.id),
      with: {
        messages: true,
      },
      orderBy: (chats, { desc }) => [desc(chats.id)],
    });
  }

  return await db.query.chats.findMany({
    where: ({ performerId }) =>
      or(eq(performerId, user.id), isNull(performerId)),
    with: {
      messages: true,
    },
    orderBy: (chats, { desc }) => [desc(chats.id)],
  });
});
