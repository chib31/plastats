import {
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface Props<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading: boolean;
  isError: boolean;
}

export function StatsTable<T>({ columns, data, sorting, onSortingChange, isLoading, isError }: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <p className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500">
        Couldn’t load stats — is the API running?
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-neutral-200 bg-neutral-50">
              {hg.headers.map((header, i) => {
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={[
                      'cursor-pointer select-none whitespace-nowrap px-3 py-2.5 font-semibold',
                      i === 0 ? 'text-left' : 'text-right',
                      sorted ? 'text-brand-dark' : 'text-neutral-600 hover:text-neutral-900',
                    ].join(' ')}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="ml-1 inline-block w-2 text-brand">
                      {sorted === 'asc' ? '▲' : sorted === 'desc' ? '▼' : ''}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, r) => (
                <tr key={r} className="border-b border-neutral-100">
                  {columns.map((_c, i) => (
                    <td key={i} className="px-3 py-2.5">
                      <div className="h-4 rounded bg-neutral-100" />
                    </td>
                  ))}
                </tr>
              ))
            : table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100 hover:bg-brand/5">
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      key={cell.id}
                      className={[
                        'whitespace-nowrap px-3 py-2',
                        i === 0 ? 'text-left font-medium' : 'text-right tabular-nums',
                      ].join(' ')}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!isLoading && data.length === 0 && (
        <p className="p-8 text-center text-neutral-500">No players yet.</p>
      )}
    </div>
  );
}
