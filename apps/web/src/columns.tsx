import type { BattingRow, BowlingRow } from '@plastats/shared';
import type { ColumnDef } from '@tanstack/react-table';

/** Format a derived rate: 2 dp, or an em dash when undefined (e.g. average with no dismissals). */
const dec = (v: number | null | undefined) => (v == null ? '—' : v.toFixed(2));

export const battingColumns: ColumnDef<BattingRow, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Player' },
  { id: 'innings', accessorKey: 'innings', header: 'Inns' },
  { id: 'notOuts', accessorKey: 'notOuts', header: 'NO' },
  { id: 'runs', accessorKey: 'runs', header: 'Runs' },
  {
    id: 'highScore',
    accessorKey: 'highScore',
    header: 'HS',
    cell: ({ row }) => `${row.original.highScore}${row.original.highScoreNotOut ? '*' : ''}`,
  },
  { id: 'average', accessorKey: 'average', header: 'Avg', cell: ({ getValue }) => dec(getValue() as number | null) },
  { id: 'strikeRate', accessorKey: 'strikeRate', header: 'SR', cell: ({ getValue }) => dec(getValue() as number | null) },
  { id: 'fifties', accessorKey: 'fifties', header: '50s' },
  { id: 'hundreds', accessorKey: 'hundreds', header: '100s' },
  { id: 'fours', accessorKey: 'fours', header: '4s' },
  { id: 'sixes', accessorKey: 'sixes', header: '6s' },
  { id: 'ballsFaced', accessorKey: 'ballsFaced', header: 'Balls' },
  {
    id: 'ballsPerBoundary',
    accessorKey: 'ballsPerBoundary',
    header: 'BPB',
    cell: ({ getValue }) => dec(getValue() as number | null),
  },
];

export const bowlingColumns: ColumnDef<BowlingRow, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Player' },
  // Sort by ball count; display the cricket overs string.
  { id: 'ballsBowled', accessorKey: 'overs', header: 'Overs' },
  { id: 'maidens', accessorKey: 'maidens', header: 'Mdns' },
  { id: 'runsConceded', accessorKey: 'runsConceded', header: 'Runs' },
  { id: 'wickets', accessorKey: 'wickets', header: 'Wkts' },
  { id: 'average', accessorKey: 'average', header: 'Avg', cell: ({ getValue }) => dec(getValue() as number | null) },
  { id: 'economy', accessorKey: 'economy', header: 'Econ', cell: ({ getValue }) => dec(getValue() as number | null) },
  { id: 'strikeRate', accessorKey: 'strikeRate', header: 'SR', cell: ({ getValue }) => dec(getValue() as number | null) },
  { id: 'fiveWicketInnings', accessorKey: 'fiveWicketInnings', header: '5wi' },
];
