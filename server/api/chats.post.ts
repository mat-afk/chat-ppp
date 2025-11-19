import { prisma } from "~~/server/lib/prisma";
import { inputSchema } from "~~/shared/lib/zod";

export default defineEventHandler(async (event) => {
  const { input } = await readValidatedBody(event, inputSchema.parse);

  const { user } = await requireUserSession(event);

  if (user.type === "PERFORMER") {
    throw createError({
      statusCode: 409,
      message: "Você não pode iniciar um chat como um performer.",
    });
  }

  const firts10Words = input.split(" ").splice(0, 10).join(" ");

  const chat = await prisma.chat.create({
    data: { title: firts10Words, guestId: user.id, lastMessageSender: "GUEST" },
  });

  await prisma.message.create({
    data: { content: input, sender: "GUEST", chatId: chat.id },
  });

  return chat;
});
