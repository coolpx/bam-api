/*
  Warnings:

  - The primary key for the `PlayerLeaderboardStats` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Message" ALTER COLUMN "senderId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."PlayerLeaderboardStats" DROP CONSTRAINT "PlayerLeaderboardStats_pkey",
ALTER COLUMN "userId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "PlayerLeaderboardStats_pkey" PRIMARY KEY ("userId");
