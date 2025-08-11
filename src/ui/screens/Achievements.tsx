import { useAchievements, ACHIEVEMENTS } from '../../state/achievements';
import { TrophyIcon, PineIcon } from '../assets/lodgeIcons';

export function Achievements() {
  const unlocked = useAchievements((s) => s.unlocked);
  const total = Object.keys(ACHIEVEMENTS).length;
  const earned = Object.values(unlocked).filter(Boolean).length;
  return (
    <section className="mx-auto max-w-6xl grid gap-6">
      {/* Hero */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrophyIcon />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Achievements</h1>
        </div>
        <div className="text-sm text-slate-700">
          {earned}/{total} unlocked
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ACHIEVEMENTS).map((a) => {
          const isUnlocked = Boolean(unlocked[a.id]);
          return (
            <li
              key={a.id}
              className={`rounded-2xl border p-4 shadow-sm transition ${
                isUnlocked ? 'bg-white' : 'bg-white/70 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-slate-900">{a.title}</div>
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lake-200 text-lake-900 px-2 py-0.5 text-xs border border-lake-300/60">
                    <PineIcon /> Earned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs border border-slate-200">
                    Locked
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-700">{a.description}</div>
              {isUnlocked && (
                <div className="text-xs mt-2 text-slate-600">Unlocked {new Date(unlocked[a.id]!).toLocaleString()}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}


