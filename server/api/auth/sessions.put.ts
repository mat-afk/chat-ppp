import { prisma } from "~~/server/lib/prisma";
import { sessionTokenSchema } from "~~/shared/lib/zod";

async function getOrCreateGuest(sessionToken: string | undefined) {
  if (!sessionToken) {
    const token = Date.now() + "_" + crypto.randomUUID();

    return await prisma.guest.create({ data: { sessionToken: token } });
  }

  const guest = prisma.guest.findUnique({ where: { sessionToken } });

  if (guest) return guest;

  return await prisma.guest.create({ data: { sessionToken } });
}

export default defineEventHandler(async (event) => {
  const { sessionToken } = await readValidatedBody(
    event,
    sessionTokenSchema.parse
  );

  const guest = await getOrCreateGuest(sessionToken);

  if (!guest) {
    throw createError({
      statusCode: 500,
      message: "Erro no servidor",
    });
  }

  await setUserSession(event, { user: { id: guest.id, type: "GUEST" } });

  return guest;
});
