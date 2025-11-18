import z from "zod";
import { prisma } from "../lib/prisma";

const bodySchema = z.object({
  input: z.string(),
});

export default defineEventHandler(async (event) => {
  const { input } = await readValidatedBody(event, bodySchema.parse);

  const { user } = await requireUserSession(event);

  if (user.type === "PERFORMER") {
    throw createError({
      statusCode: 409,
      message: "Você não pode iniciar um chat como um performer.",
    });
  }

  const chat = await prisma.chat.create({
    data: { title: input, guestId: user.id, lastMessageSender: "GUEST" },
  });

  await prisma.message.create({
    data: { content: input, sender: "GUEST", chatId: chat.id },
  });

  return chat;
});
