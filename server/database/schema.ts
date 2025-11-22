import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const chatStatus = pgEnum("chat_status", ["WAITING", "IN_PROGRESS"]);
export const messageSender = pgEnum("message_sender", ["GUEST", "PERFORMER"]);

export const guests = pgTable("guests", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const guestsRelations = relations(guests, ({ many }) => ({
  chats: many(chats),
}));

export const performers = pgTable("performers", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const performersRelations = relations(performers, ({ many }) => ({
  chats: many(chats),
}));

export const chats = pgTable(
  "chats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    status: chatStatus("status")
      .notNull()
      .$defaultFn(() => "WAITING"),
    guestId: uuid("guest_id").notNull(),
    performerId: uuid("performer_id"),
    lastMessageSender: messageSender("last_message_sender")
      .notNull()
      .$defaultFn(() => "GUEST"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    assumedAt: timestamp("assumed_at"),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("chat_guest_id_index").on(table.guestId),
    index("chat_performer_id_index").on(table.performerId),
  ]
);

export const chatsRelations = relations(chats, ({ one, many }) => ({
  guest: one(guests, {
    fields: [chats.guestId],
    references: [guests.id],
  }),
  performer: one(performers, {
    fields: [chats.performerId],
    references: [performers.id],
  }),
  messages: many(messages),
}));

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    sender: messageSender().notNull(),
    chatId: uuid()
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    sentAt: timestamp("sent_at").notNull().defaultNow(),
  },
  (table) => [index("messages_chat_id_index").on(table.chatId)]
);

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));
