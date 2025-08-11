import type { Suit } from '../../game/rules/deck';
import { suitGlyph } from './handBits';

type TrumpIndicatorProps = {
  trump: Suit | null;
  alone: boolean;
};

export function TrumpIndicator({ trump, alone }: TrumpIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-black/30 text-white px-3 py-1 shadow-sm">
      <span className="text-sm">Trump:</span>
      <span className="text-lg" aria-live="polite">{trump ? suitGlyph(trump) : '—'}</span>
      {alone && <span className="text-xs opacity-80">alone</span>}
    </div>
  );
}


