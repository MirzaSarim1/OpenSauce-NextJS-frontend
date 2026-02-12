/*
  Warnings:

  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FOLLOW', 'FAVORITE', 'REVIEW', 'SYSTEM');

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isRead",
DROP COLUMN "link",
ADD COLUMN     "data" JSONB,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
