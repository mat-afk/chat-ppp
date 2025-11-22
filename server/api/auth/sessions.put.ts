import { eq, tables, useDrizzle } from "~~/server/utils/drizzle";
import { sessionTokenSchema } from "~~/shared/lib/zod";

async function getOrCreateGuest(sessionToken: string | undefined) {
  const db = useDrizzle();

  if (!sessionToken) {
    const token = Date.now() + "_" + crypto.randomUUID();

    const [guest] = await db
      .insert(tables.guests)
      .values({ sessionToken: token })
      .returning();

    return guest;
  }

  let guest = await db.query.guests.findFirst({
    where: eq(tables.guests.sessionToken, sessionToken),
  });

  if (guest) return guest;

  [guest] = await db
    .insert(tables.guests)
    .values({
      sessionToken,
    })
    .returning();

  return guest;
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

  await replaceUserSession(event, { user: { id: guest.id, type: "GUEST" } });

  return guest;
});
