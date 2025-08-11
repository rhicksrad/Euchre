import { useNavigate } from 'react-router-dom';
import { getDailyChallenge, getTodayId } from '../../services/daily';
import { useDailyStore } from '../../state/dailyStore';
import { useAppStore } from '../../app/providers/state';

export function Daily() {
  const nav = useNavigate();
  const daily = getDailyChallenge();
  const completed = useDailyStore((s) => s.completed);
  const markCompleted = useDailyStore((s) => s.markCompleted);
  const isDone = Boolean(completed[daily.id]);
  const setSeed = useAppStore((s) => s.setSeed);

  const historyEntries = Object.keys(completed)
    .sort((a, b) => (a < b ? 1 : -1))
    .slice(0, 14);

  return (
    <section className="mx-auto max-w-6xl grid gap-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Challenge</h1>
        <p className="text-slate-700 text-sm mt-1">A new seeded challenge each day. Today’s seed is derived from the date for fair competition.</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">{daily.description}</div>
            <div className="text-sm text-slate-600">Today: {daily.id}</div>
          </div>
          <div className="flex items-center gap-2">
            {isDone ? (
              <span className="rounded-full bg-green-100 text-green-800 text-xs px-2 py-1">Completed</span>
            ) : (
              <span className="rounded-full bg-amber-100 text-amber-800 text-xs px-2 py-1">Unfinished</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded bg-lodge-pine text-white px-4 py-2"
            onClick={() => {
              setSeed(daily.seed);
              nav('/game');
            }}
          >
            Play Today’s Seed
          </button>
          {!isDone && (
            <button
              className="rounded border px-4 py-2"
              onClick={() => markCompleted(getTodayId())}
            >
              Mark Complete (manual)
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-2">
        <div className="text-lg font-semibold text-slate-900">Recent Results</div>
        {historyEntries.length === 0 ? (
          <div className="text-sm text-slate-600">No daily results yet.</div>
        ) : (
          <ul className="grid gap-1">
            {historyEntries.map((id) => (
              <li key={id} className="text-sm text-slate-700 flex items-center gap-2">
                <span className="w-24 font-mono">{id}</span>
                <span className={`text-xs rounded px-2 py-0.5 ${completed[id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                  {completed[id] ? 'Completed' : 'Missed'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}


