/*
  Warnings:

  - You are about to drop the column `playerCount` on the `Tower` table. All the data in the column will be lost.
  - You are about to drop the column `playerCountUpdated` on the `Tower` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Tower" DROP COLUMN "playerCount",
DROP COLUMN "playerCountUpdated",
ADD COLUMN     "players" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "playersUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
