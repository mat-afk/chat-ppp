CREATE TYPE "public"."chat_status" AS ENUM('WAITING', 'IN_PROGRESS');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('GUEST', 'PERFORMER');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"status" "chat_status" NOT NULL,
	"guest_id" uuid NOT NULL,
	"performer_id" uuid,
	"last_message_sender" "message_sender" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"assumed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionToken" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guests_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"sender" "message_sender" NOT NULL,
	"chatId" uuid NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "performers_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_guest_id_index" ON "chats" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "chat_performer_id_index" ON "chats" USING btree ("performer_id");--> statement-breakpoint
CREATE INDEX "messages_chat_id_index" ON "messages" USING btree ("chatId");