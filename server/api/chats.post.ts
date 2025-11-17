import z from "zod";

const bodySchema = z.object({
  input: z.string(),
});

export default defineEventHandler(async (event) => {
  const { input } = await readValidatedBody(event, bodySchema.parse);

  const session = await getUserSession(event);

  return "Hello Nitro";
});
