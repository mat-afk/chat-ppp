-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('GUEST', 'PERFORMER');

-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('WAITING', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "performers" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "status" "ChatStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assumedAt" TIMESTAMP(3),
    "guestId" INTEGER NOT NULL,
    "performerId" INTEGER,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "performers_key_key" ON "performers"("key");

-- CreateIndex
CREATE UNIQUE INDEX "guests_sessionToken_key" ON "guests"("sessionToken");

-- CreateIndex
CREATE INDEX "chats_status_idx" ON "chats"("status");

-- CreateIndex
CREATE INDEX "chats_guestId_idx" ON "chats"("guestId");

-- CreateIndex
CREATE INDEX "chats_performerId_idx" ON "chats"("performerId");

-- CreateIndex
CREATE INDEX "messages_chatId_sentAt_idx" ON "messages"("chatId", "sentAt");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "performers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
