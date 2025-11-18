/*
  Warnings:

  - The primary key for the `guests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `performers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `lastMessageSender` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_guestId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_performerId_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "lastMessageSender" "MessageSender" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "guestId" SET DATA TYPE TEXT,
ALTER COLUMN "performerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "guests" DROP CONSTRAINT "guests_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "guests_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "guests_id_seq";

-- AlterTable
ALTER TABLE "performers" DROP CONSTRAINT "performers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "performers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "performers_id_seq";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "performers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
