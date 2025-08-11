import { Link, useNavigate } from 'react-router-dom';
import { CHARACTERS, type CharacterDef } from '../../game/characters';
import { CharacterAvatar } from '../assets/characters';
import { useAppStore } from '../../app/providers/state';
import { PRNG } from '../../utils/prng';
import { useGameStore } from '../../state/store';
import { clearAllSaves } from '../../services/persistence';
import { getSavedGamePhase } from '../../services/saveInfo';

export function StartMenu() {
  const seed = useAppStore((s) => s.seed);
  const setSeed = useAppStore((s) => s.setSeed);
  const startNewHand = useGameStore((s) => s.startNewHand);
  const nav = useNavigate();
  const setSeatCharacters = useGameStore((s) => s.setSeatCharacters);
  const pickCharacter = (c: CharacterDef) => {
    // Deterministically assign remaining NPCs order using PRNG
    const prng = new PRNG(`${seed}-chars`);
    const pool = CHARACTERS.filter((x) => x.id !== c.id);
    prng.shuffleInPlace(pool);
    const seatAssign: Record<0|1|2|3, typeof c.id> = { 0: c.id, 1: pool[0].id, 2: pool[1].id, 3: pool[2].id };
    setSeatCharacters(seatAssign);
    startNewHand();
    nav('/game');
  };

  const hasSave = Boolean(localStorage.getItem('euchre-v1'));
  const savedPhase = getSavedGamePhase();

  return (
    <section aria-labelledby="home-title" className="grid gap-6">
      <h1 id="home-title" className="text-2xl font-bold">Welcome to the Lodge</h1>
      <p className="max-w-prose opacity-80">Choose your character to begin.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CHARACTERS.map((c) => (
          <button key={c.id} className="rounded-md border bg-white p-3 text-left hover:shadow focus:outline-none focus:ring-2 focus:ring-lodge-lake" onClick={() => pickCharacter(c)}>
            <div className="flex items-center gap-3">
              {CharacterAvatar[c.id]}
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs opacity-80">{c.bio}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm" htmlFor="seed">Seed</label>
        <input id="seed" value={seed} onChange={(e) => setSeed(e.target.value)} className="rounded border px-2 py-1 text-sm" />
      </div>
      <div className="flex gap-3">
        <Link to="/settings" className="inline-flex items-center rounded-md bg-white px-4 py-2 shadow border hover:bg-lodge-canvas/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lodge-lake">Settings</Link>
        <Link to="/about" className="inline-flex items-center rounded-md bg-white px-4 py-2 shadow border hover:bg-lodge-canvas/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lodge-lake">About</Link>
        {hasSave && (
          <button className="inline-flex items-center rounded-md bg-lodge-pine px-4 py-2 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lodge-lake" onClick={() => nav('/game')}>
            Continue{savedPhase ? ` (${savedPhase})` : ''}
          </button>
        )}
        <button className="inline-flex items-center rounded-md bg-white px-4 py-2 shadow border hover:bg-lodge-canvas/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lodge-lake" onClick={() => { clearAllSaves(); location.reload(); }}>
          Reset Saves
        </button>
      </div>
    </section>
  );
}


