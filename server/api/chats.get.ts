import { prisma } from "~~/server/lib/prisma";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.type === "GUEST") {
    return await prisma.chat.findMany({ where: { guestId: user.id } });
  }

  return await prisma.chat.findMany({
    where: { OR: [{ performerId: user.id }, { performerId: null }] },
  });
});
