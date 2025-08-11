type GameLogProps = {
  lines: readonly string[];
};

export function GameLog({ lines }: GameLogProps) {
  return (
    <section className="rounded-xl border bg-lodge-parchment p-3 h-64 overflow-auto shadow-sm" aria-live="polite" aria-label="Game log">
      <ul className="text-sm space-y-1 text-slate-800">
        {lines.slice().reverse().map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </section>
  );
}


