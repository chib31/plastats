/**
 * Shared API contracts and stat models for Plastats.
 * Consumed by both the NestJS API (`apps/api`) and the React web app (`apps/web`).
 *
 * Merge rule reminder (see skills/coding.md §5.3): the API sums raw counting stats
 * across sources, recomputes all derived rates, and takes the max High Score.
 */

/** Which data source(s) contributed to a combined row. */
export type DataSource = 'legacy' | 'play-cricket';

/** Generic server-driven pagination/sort query (tables are server-driven). */
export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/** Generic paginated response envelope. */
export interface Paginated<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** One player's all-time combined batting record. */
export interface BattingRow {
  /** Play-Cricket player_id; null for legacy-only players. */
  playerId: number | null;
  name: string;
  innings: number;
  notOuts: number;
  runs: number;
  highScore: number;
  /** Only known for Play-Cricket (2019+) data; undefined for legacy-only highs. */
  highScoreNotOut?: boolean;
  /** Runs / (innings - notOuts); null when the denominator is 0. */
  average: number | null;
  /** 100 * runs / ballsFaced; null when ballsFaced is 0. */
  strikeRate: number | null;
  fours: number;
  sixes: number;
  ballsFaced: number;
  fifties: number;
  hundreds: number;
  /** ballsFaced / (fours + sixes); null when no boundaries. */
  ballsPerBoundary: number | null;
  sources: DataSource[];
}

/** One player's all-time combined bowling record. */
export interface BowlingRow {
  /** Play-Cricket player_id; null for legacy-only players. */
  playerId: number | null;
  name: string;
  /** Display overs derived from ballsBowled, e.g. "66.4". */
  overs: string;
  ballsBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  /** runsConceded / wickets; null when wickets is 0. */
  average: number | null;
  /** 6 * runsConceded / ballsBowled; null when ballsBowled is 0. */
  economy: number | null;
  /** ballsBowled / wickets; null when wickets is 0. */
  strikeRate: number | null;
  fiveWicketInnings: number;
  sources: DataSource[];
}

export const BATTING_SORT_KEYS = [
  'name',
  'innings',
  'notOuts',
  'runs',
  'highScore',
  'average',
  'strikeRate',
  'fours',
  'sixes',
  'ballsFaced',
  'fifties',
  'hundreds',
  'ballsPerBoundary',
] as const;
export type BattingSortKey = (typeof BATTING_SORT_KEYS)[number];

export const BOWLING_SORT_KEYS = [
  'name',
  'ballsBowled',
  'maidens',
  'runsConceded',
  'wickets',
  'average',
  'economy',
  'strikeRate',
  'fiveWicketInnings',
] as const;
export type BowlingSortKey = (typeof BOWLING_SORT_KEYS)[number];
