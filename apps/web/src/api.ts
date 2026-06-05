import type { BattingRow, BowlingRow, Paginated } from '@plastats/shared';

// Empty base => relative URLs, served via the Vite dev proxy. In production set
// VITE_API_URL to the API origin.
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return (await res.json()) as T;
}

export function fetchBatting(sort: string, order: string) {
  const qs = new URLSearchParams({ sort, order, pageSize: '200' });
  return get<Paginated<BattingRow>>(`/api/batting?${qs}`);
}

export function fetchBowling(sort: string, order: string) {
  const qs = new URLSearchParams({ sort, order, pageSize: '200' });
  return get<Paginated<BowlingRow>>(`/api/bowling?${qs}`);
}
