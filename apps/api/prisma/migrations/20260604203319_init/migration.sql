-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "playCricketId" INTEGER,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerAlias" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "PlayerAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyBatting" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "innings" INTEGER NOT NULL,
    "notOuts" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "highScore" INTEGER NOT NULL,
    "fours" INTEGER NOT NULL,
    "sixes" INTEGER NOT NULL,
    "ballsFaced" INTEGER NOT NULL,
    "fifties" INTEGER NOT NULL,
    "hundreds" INTEGER NOT NULL,

    CONSTRAINT "LegacyBatting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyBowling" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "ballsBowled" INTEGER NOT NULL,
    "maidens" INTEGER NOT NULL,
    "runsConceded" INTEGER NOT NULL,
    "wickets" INTEGER NOT NULL,
    "fiveWicketInnings" INTEGER NOT NULL,

    CONSTRAINT "LegacyBowling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_playCricketId_key" ON "Player"("playCricketId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerAlias_alias_key" ON "PlayerAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "LegacyBatting_playerId_key" ON "LegacyBatting"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "LegacyBowling_playerId_key" ON "LegacyBowling"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerAlias" ADD CONSTRAINT "PlayerAlias_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyBatting" ADD CONSTRAINT "LegacyBatting_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyBowling" ADD CONSTRAINT "LegacyBowling_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
