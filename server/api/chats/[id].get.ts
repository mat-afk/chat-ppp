import z from "zod";
import { prisma, Prisma } from "~~/server/lib/prisma";

const paramsSchema = z.object({
  id: z.string(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  const where: Prisma.ChatWhereUniqueInput = { id };

  if (user.type === "GUEST") where.guestId = user.id;
  else where.performerId = user.id;

  return await prisma.chat.findUnique({
    where,
    include: { messages: { orderBy: { sentAt: "asc" } } },
  });
});
