type ScoreKittyProps = {
  teamLabel: string;
  score: number; // 0..10
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(10, Math.floor(n)));
}

function sixAndFourFromScore(score: number): { six: number; four: number } {
  const s = clampScore(score);
  if (s <= 5) return { six: s, four: 0 };
  if (s <= 9) return { six: 5, four: s - 5 };
  return { six: 5, four: 4 };
}

const pipPositions6 = [
  [50, 40],
  [30, 80],
  [70, 80],
  [30, 120],
  [70, 120],
] as const;

const pipPositions4 = [
  [50, 40],
  [30, 80],
  [70, 80],
  [50, 120],
] as const;

export function ScoreKitty({ teamLabel, score }: ScoreKittyProps) {
  const { six, four } = sixAndFourFromScore(score);
  return (
    <section aria-label={`Scoreboard for ${teamLabel}`} className="grid gap-2 bg-lodge-parchment rounded-md border p-2 shadow accent-theme">
      <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">{teamLabel}</div>
      <div className="flex items-center gap-2" role="group" aria-label={`${teamLabel} score: ${score}`}>
        <CardSvg title="Six card" pips={six} variant="six" />
        <CardSvg title="Four card" pips={four} variant="four" />
        <div className="ml-2 text-sm font-semibold text-slate-900" aria-live="polite">{score} / 10</div>
      </div>
    </section>
  );
}

function CardSvg({ title, pips, variant }: { title: string; pips: number; variant: 'six' | 'four' }) {
  const positions = variant === 'six' ? pipPositions6 : pipPositions4;
  return (
    <svg
      viewBox="0 0 120 160"
      width={80}
      height={106}
      role="img"
      aria-label={`${title} with ${pips} pips visible`}
      className="drop-shadow"
    >
      <defs>
        <linearGradient id="cardParch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf2" />
          <stop offset="100%" stopColor="#f3ecdd" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="116" height="156" rx="10" fill="url(#cardParch)" stroke="#1f2937" strokeWidth="3" />
      <rect x="10" y="10" width="100" height="140" rx="8" fill="#fff" fillOpacity="0.35" />
      {positions.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={9} fill={i < pips ? '#0f172a' : '#94a3b8'} />
      ))}
      <text x="12" y="22" fontSize="12" fill="#334155" fontWeight="700">{variant === 'six' ? '6' : '4'}</text>
    </svg>
  );
}

export const __internal = { sixAndFourFromScore, clampScore };


