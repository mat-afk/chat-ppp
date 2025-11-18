import { prisma } from "~~/server/lib/prisma";
import { keySchema } from "~~/server/lib/zod";

export default defineEventHandler(async (event) => {
  const { key } = await readValidatedBody(event, keySchema.parse);

  const hashedKey = await hashPassword(key);

  const performer = await prisma.performer.findUnique({
    where: { key: hashedKey },
  });

  if (!performer) {
    throw createError({
      statusCode: 404,
      message: "Performer não encontrado.",
    });
  }

  await setUserSession(event, {
    user: { id: performer.id, type: "PERFORMER" },
  });

  return performer;
});
