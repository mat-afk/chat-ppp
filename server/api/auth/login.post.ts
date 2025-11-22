import { eq, tables, useDrizzle } from "~~/server/utils/drizzle";
import { keySchema } from "~~/shared/lib/zod";

export default defineEventHandler(async (event) => {
  const { key } = await readValidatedBody(event, keySchema.parse);

  const db = useDrizzle();

  const performer = await db.query.performers.findFirst({
    where: eq(tables.performers.key, key),
  });

  if (!performer) {
    throw createError({
      statusCode: 404,
      message: "Performer não encontrado.",
    });
  }

  await replaceUserSession(event, {
    user: { id: performer.id, type: "PERFORMER" },
  });

  return performer;
});
