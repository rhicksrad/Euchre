import { useStats } from '../../state/stats';

export function Stats() {
  const s = useStats();
  const nsWinRate = rate(s.gamesWonNS, s.gamesPlayed);
  const ewWinRate = rate(s.gamesWonEW, s.gamesPlayed);
  const avgTricksNS = avg(s.tricksTakenNS, s.handsPlayed);
  const avgTricksEW = avg(s.tricksTakenEW, s.handsPlayed);
  return (
    <section className="mx-auto max-w-6xl grid gap-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Stats</h1>
        <p className="text-slate-700 text-sm mt-1">A snapshot of your play history.</p>
      </div>

      {/* Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Highlight title="Games Played" value={s.gamesPlayed} />
        <Highlight title="Win Rate (NS)" value={nsWinRate} suffix="%" />
        <Highlight title="Win Rate (EW)" value={ewWinRate} suffix="%" />
      </div>

      {/* Detailed cards */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Wins (NS)" value={s.gamesWonNS} />
          <Stat label="Wins (EW)" value={s.gamesWonEW} />
          <Stat label="Hands Played" value={s.handsPlayed} />
          <Stat label="Euchres" value={s.euchres} />
          <Stat label="Avg Tricks (NS)" value={avgTricksNS} />
          <Stat label="Avg Tricks (EW)" value={avgTricksEW} />
          <Stat label="Lone Hands" value={s.loneHands} />
        </div>
        <div className="flex justify-end">
          <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50" onClick={() => s.reset()}>Reset Stats</button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition-shadow">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900 mt-1">{typeof value === 'number' ? value : value}</div>
    </div>
  );
}

function Highlight({ title, value, suffix }: { title: string; value: number; suffix?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md ring-1 ring-black/5 hover:shadow-lg transition-shadow">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-lake-200/50 blur-2xl" />
      <div className="relative">
        <div className="text-sm font-medium text-slate-700">{title}</div>
        <div className="mt-1 text-4xl font-extrabold text-slate-900">
          {isNaN(value) ? '—' : value}
          {suffix && !isNaN(value) ? <span className="text-xl align-super ml-0.5">{suffix}</span> : null}
        </div>
      </div>
    </div>
  );
}

function rate(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function avg(total: number, count: number): string {
  if (!count) return '—';
  return (total / count).toFixed(2);
}


