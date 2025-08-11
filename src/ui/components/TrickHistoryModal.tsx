import { useMemo } from 'react';
import { useGameStore } from '../../state/store';
import type { Card, Suit } from '../../game/rules/deck';
import { suitGlyph } from './handBits';
import { CardView } from './CardView';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TrickHistoryModal({ open, onClose }: Props) {
  const history = useGameStore((s) => s.trickHistory);
  const trump = useGameStore((s) => s.trump);

  const items = useMemo(() => history, [history]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-[90] grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[min(720px,92vw)] max-h-[80vh] overflow-auto rounded-xl bg-white p-4 shadow-xl text-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">Trick History</h2>
          <button className="rounded border px-3 py-1" onClick={onClose}>Close</button>
        </div>
        <div className="text-sm mb-3">Trump: {trump ? suitGlyph(trump as Suit) : '-'}</div>
        <ol className="grid gap-3">
          {items.map((t) => (
            <li key={t.trickIndex} className="rounded-lg border p-3 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">Trick {t.trickIndex + 1}</div>
                <div className="text-xs text-slate-600">Lead: P{t.lead} · Winner: P{t.winner}</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {t.plays.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded border px-2 py-1 bg-slate-50">
                    <span className="text-xs text-slate-600">P{p.player}</span>
                    <CardView card={p.card as Card} compact />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}


