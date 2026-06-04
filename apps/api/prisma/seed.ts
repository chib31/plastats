import { PrismaClient } from '@prisma/client';
import legacy from './data/legacy-2016-2018.json';

const prisma = new PrismaClient();

interface LegacyPlayer {
  name: string;
  aliases: string[];
  batting: {
    innings: number;
    runs: number;
    notOuts: number;
    fours: number;
    sixes: number;
    highScore: number;
    ballsFaced: number;
    fifties: number;
    hundreds: number;
  } | null;
  bowling: {
    ballsBowled: number;
    maidens: number;
    wickets: number;
    runsConceded: number;
    fiveWicketInnings: number;
  } | null;
}

async function main() {
  const players = legacy.players as LegacyPlayer[];
  console.log(`Seeding ${players.length} legacy (${legacy.seasons}) players...`);

  // v1 is legacy-only: reset the baseline so the seed is idempotent.
  // The Play-Cricket ETL (#9/#10) will update players incrementally rather than reset.
  await prisma.legacyBatting.deleteMany();
  await prisma.legacyBowling.deleteMany();
  await prisma.playerAlias.deleteMany();
  await prisma.player.deleteMany();

  let bat = 0;
  let bowl = 0;
  for (const p of players) {
    const player = await prisma.player.create({
      data: {
        name: p.name,
        aliases: { create: p.aliases.map((alias) => ({ alias })) },
      },
    });
    if (p.batting) {
      await prisma.legacyBatting.create({ data: { playerId: player.id, ...p.batting } });
      bat++;
    }
    if (p.bowling) {
      await prisma.legacyBowling.create({ data: { playerId: player.id, ...p.bowling } });
      bowl++;
    }
  }

  console.log(`Done: ${players.length} players, ${bat} with batting, ${bowl} with bowling.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
