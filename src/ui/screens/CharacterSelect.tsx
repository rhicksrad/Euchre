import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CHARACTERS, type CharacterDef } from '../../game/characters';
import { CharacterAvatar } from '../assets/characters';
import { useAppStore } from '../../app/providers/state';
import { PRNG } from '../../utils/prng';
import { useGameStore } from '../../state/store';

export function CharacterSelect() {
  const seed = useAppStore((s) => s.seed);
  const startNewHand = useGameStore((s) => s.startNewHand);
  const setSeatCharacters = useGameStore((s) => s.setSeatCharacters);
  const nav = useNavigate();

  const pickCharacter = (c: CharacterDef) => {
    const prng = new PRNG(`${seed}-chars`);
    const pool = CHARACTERS.filter((x) => x.id !== c.id);
    prng.shuffleInPlace(pool);
    const assign: Record<0|1|2|3, (typeof CHARACTERS)[number]['id']> = { 0: c.id, 1: pool[0].id, 2: pool[1].id, 3: pool[2].id };
    // store expects CharacterId mapping; narrow to expected type via function arg type
    setSeatCharacters(assign as unknown as Record<0|1|2|3, (typeof CHARACTERS)[number]['id']>);
    startNewHand();
    nav('/game');
  };

  return (
    <section aria-labelledby="char-title" className="mx-auto max-w-6xl grid gap-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 id="char-title" className="text-3xl font-bold tracking-tight text-slate-900">Choose your character</h1>
        <p className="text-slate-700 text-sm mt-1">Click a card to take the seat.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {CHARACTERS.map((c) => (
          <button key={c.id} className="group rounded-2xl border bg-white p-4 text-left shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-lake-300/60 transition text-slate-800 relative overflow-hidden" onClick={() => pickCharacter(c)}>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-lake-200 opacity-0 group-hover:opacity-60 blur-2xl transition" />
            <div className="flex items-center gap-3">
              <FaceAvatar id={c.id} />
              <div>
                <div className="font-semibold text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-600">{c.bio}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Seed controls removed from Character screen */}
    </section>
  );
}

function FaceAvatar({ id }: { id: (typeof CHARACTERS)[number]['id'] }) {
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const src = `/characters/${id}.svg`;
    fetch(src, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const txt = await r.text();
        if (!cancelled) setMarkup(txt);
      })
      .catch(() => setFailed(true));
    return () => { cancelled = true; };
  }, [id]);
  if (failed) return <div className="h-16 w-16" aria-label={`Avatar ${id}`}>{CharacterAvatar[id]}</div>;
  if (markup) {
    return <div className="h-16 w-16" role="img" aria-label={`Avatar ${id}`} dangerouslySetInnerHTML={{ __html: markup }} />;
  }
  return <div className="h-16 w-16 rounded-full border border-emerald-900/30 bg-emerald-50/40" aria-label={`Avatar ${id}`} />;
}


