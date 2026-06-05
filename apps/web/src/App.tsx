import { useQuery } from '@tanstack/react-query';
import type { OnChangeFn, SortingState } from '@tanstack/react-table';
import { type ReactNode, useState } from 'react';
import { fetchBatting, fetchBowling } from './api';
import { battingColumns, bowlingColumns } from './columns';
import { StatsTable } from './components/StatsTable';

type Tab = 'batting' | 'bowling';

export default function App() {
  const [tab, setTab] = useState<Tab>('batting');
  const [battingSort, setBattingSort] = useState<SortingState>([{ id: 'runs', desc: true }]);
  const [bowlingSort, setBowlingSort] = useState<SortingState>([{ id: 'wickets', desc: true }]);

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b-4 border-brand bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <img src="/plastics-logo.svg" alt="Plastics CC logo" className="h-14 w-14" />
          <div>
            <h1 className="font-display text-3xl font-bold leading-none">Plastats</h1>
            <p className="mt-1 text-sm text-neutral-500">Plastics CC · all-time stats · est. 2016</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="mb-4 flex gap-1 border-b border-neutral-200">
          <TabButton active={tab === 'batting'} onClick={() => setTab('batting')}>
            Batting
          </TabButton>
          <TabButton active={tab === 'bowling'} onClick={() => setTab('bowling')}>
            Bowling
          </TabButton>
        </div>

        {tab === 'batting' ? (
          <BattingTab sorting={battingSort} onSortingChange={setBattingSort} />
        ) : (
          <BowlingTab sorting={bowlingSort} onSortingChange={setBowlingSort} />
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-neutral-500">
          <p>Powered by ECB Play-Cricket.</p>
          <p className="mt-1">All-time stats combine Play-Cricket (2019–) with club records (2016–18).</p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        '-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
        active ? 'border-brand text-brand-dark' : 'border-transparent text-neutral-500 hover:text-neutral-800',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function BattingTab({
  sorting,
  onSortingChange,
}: {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const sort = sorting[0]?.id ?? 'runs';
  const order = sorting[0]?.desc ? 'desc' : 'asc';
  const q = useQuery({ queryKey: ['batting', sort, order], queryFn: () => fetchBatting(sort, order) });
  return (
    <StatsTable
      columns={battingColumns}
      data={q.data?.rows ?? []}
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={q.isLoading}
      isError={q.isError}
    />
  );
}

function BowlingTab({
  sorting,
  onSortingChange,
}: {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const sort = sorting[0]?.id ?? 'wickets';
  const order = sorting[0]?.desc ? 'desc' : 'asc';
  const q = useQuery({ queryKey: ['bowling', sort, order], queryFn: () => fetchBowling(sort, order) });
  return (
    <StatsTable
      columns={bowlingColumns}
      data={q.data?.rows ?? []}
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={q.isLoading}
      isError={q.isError}
    />
  );
}
