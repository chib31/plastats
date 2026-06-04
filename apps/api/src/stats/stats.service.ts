import { Injectable } from '@nestjs/common';
import type {
  BattingRow,
  BattingSortKey,
  BowlingRow,
  BowlingSortKey,
  DataSource,
  Paginated,
} from '@plastats/shared';
import { PrismaService } from '../prisma/prisma.service';

type Order = 'asc' | 'desc';

interface QueryOpts<K> {
  page: number;
  pageSize: number;
  sort: K;
  order: Order;
}

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBatting(opts: QueryOpts<BattingSortKey>): Promise<Paginated<BattingRow>> {
    const rows = await this.buildBatting();
    return paginate(sortRows(rows, opts.sort, opts.order), opts.page, opts.pageSize);
  }

  async getBowling(opts: QueryOpts<BowlingSortKey>): Promise<Paginated<BowlingRow>> {
    const rows = await this.buildBowling();
    return paginate(sortRows(rows, opts.sort, opts.order), opts.page, opts.pageSize);
  }

  /**
   * Build all-time combined batting rows. v1 has only the legacy source; when
   * Play-Cricket data lands (#9/#10) this is where per-source totals are summed
   * by player before recomputing the derived rates.
   */
  private async buildBatting(): Promise<BattingRow[]> {
    const legacy = await this.prisma.legacyBatting.findMany({ include: { player: true } });
    return legacy.map((b): BattingRow => {
      const dismissals = b.innings - b.notOuts;
      const boundaries = b.fours + b.sixes;
      return {
        playerId: b.player.playCricketId,
        name: b.player.name,
        innings: b.innings,
        notOuts: b.notOuts,
        runs: b.runs,
        highScore: b.highScore,
        average: dismissals > 0 ? b.runs / dismissals : null,
        strikeRate: b.ballsFaced > 0 ? (100 * b.runs) / b.ballsFaced : null,
        fours: b.fours,
        sixes: b.sixes,
        ballsFaced: b.ballsFaced,
        fifties: b.fifties,
        hundreds: b.hundreds,
        ballsPerBoundary: boundaries > 0 ? b.ballsFaced / boundaries : null,
        sources: ['legacy'] as DataSource[],
      };
    });
  }

  private async buildBowling(): Promise<BowlingRow[]> {
    const legacy = await this.prisma.legacyBowling.findMany({ include: { player: true } });
    return legacy.map((b): BowlingRow => {
      return {
        playerId: b.player.playCricketId,
        name: b.player.name,
        overs: oversFromBalls(b.ballsBowled),
        ballsBowled: b.ballsBowled,
        maidens: b.maidens,
        runsConceded: b.runsConceded,
        wickets: b.wickets,
        average: b.wickets > 0 ? b.runsConceded / b.wickets : null,
        economy: b.ballsBowled > 0 ? (6 * b.runsConceded) / b.ballsBowled : null,
        strikeRate: b.wickets > 0 ? b.ballsBowled / b.wickets : null,
        fiveWicketInnings: b.fiveWicketInnings,
        sources: ['legacy'] as DataSource[],
      };
    });
  }
}

/** Cricket overs from a ball count: 6 balls = 1 over (e.g. 400 -> "66.4", 384 -> "64"). */
function oversFromBalls(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remainder = balls % 6;
  return remainder === 0 ? String(overs) : `${overs}.${remainder}`;
}

/** Stable sort with nulls always last (regardless of direction). */
function sortRows<T>(rows: T[], key: keyof T, order: Order): T[] {
  const dir = order === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[key] as unknown;
    const bv = b[key] as unknown;
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * dir;
    }
    return ((av as number) - (bv as number)) * dir;
  });
}

function paginate<T>(rows: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}
