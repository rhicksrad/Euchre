import { PRNG } from '../utils/prng';

export type DailyChallenge = {
  id: string; // YYYY-MM-DD
  seed: string; // deterministic seed for the day
  description: string;
};

export function getTodayId(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const id = getTodayId(date);
  // derive seed from date deterministically
  const prng = new PRNG(id);
  const salt = Math.floor(prng.next() * 1e9).toString(36);
  const seed = `${id}-${salt}`;
  const description = 'Win a game with at least 2 euchres today';
  return { id, seed, description };
}


