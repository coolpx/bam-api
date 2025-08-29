-- CreateTable
CREATE TABLE "public"."Tower" (
    "id" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "bricks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "senderName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerLeaderboardStats" (
    "userId" INTEGER NOT NULL,
    "playtime" INTEGER NOT NULL DEFAULT 0,
    "placedBricks" INTEGER NOT NULL DEFAULT 0,
    "rareBricks" INTEGER NOT NULL DEFAULT 0,
    "layersComplete" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlayerLeaderboardStats_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tower_id_key" ON "public"."Tower"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "public"."Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerLeaderboardStats_userId_key" ON "public"."PlayerLeaderboardStats"("userId");
