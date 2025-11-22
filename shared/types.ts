import type { Message, Chat } from "~~/server/utils/drizzle";

export type SessionType = "GUEST" | "PERFORMER";

export type NewMessagePayload = Message;
export type ChatPayload = Chat;

export type WebSocketData =
  | { event: "new-message"; payload: NewMessagePayload }
  | { event: "new-chat"; payload: ChatPayload }
  | { event: "chat-deleted"; payload: ChatPayload };
