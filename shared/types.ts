import { Prisma } from "~~/server/lib/prisma";

export type SessionType = "GUEST" | "PERFORMER";

export type NewMessagePayload = Prisma.MessageModel;
export type ChatPayload = Prisma.ChatModel;

export type WebSocketData =
  | { event: "new-message"; payload: NewMessagePayload }
  | { event: "new-chat"; payload: ChatPayload }
  | { event: "chat-deleted"; payload: ChatPayload };
