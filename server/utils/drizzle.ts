import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "~~/server/database/schema";

export { sql, eq, and, or, isNull } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(process.env.DATABASE_URL!, { schema });
}

export type Guest = typeof tables.guests.$inferSelect;
export type Performer = typeof tables.performers.$inferSelect;

export type Chat = typeof tables.chats.$inferSelect;
export type ChatStatus = "WAITING" | "IN_PROGRESS";

export type Message = typeof tables.messages.$inferSelect;
export type MessageSender = "GUEST" | "PERFORMER";
