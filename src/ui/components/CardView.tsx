import type { Card, Suit } from '../../game/rules/deck';
import { suitGlyph } from './handBits';

type Props = {
  card: Card;
  compact?: boolean;
  disabled?: boolean;
};

export function CardView({ card, compact = false, disabled = false }: Props) {
  const { suit, rank } = card;
  const size = compact ? 'h-24 w-16 text-base' : 'h-32 w-24 text-lg';
  const colors = suitClasses(suit);
  return (
    <div
      className={`relative ${size} rounded-lg border-2 shadow-md grid place-items-center select-none bg-white ${
        disabled ? 'opacity-60' : ''
      } ${colors.border}`}
      aria-hidden
    >
      <div className={`absolute left-1 top-1 text-xs opacity-90 ${colors.text}`}>
        {suitGlyph(suit)} {rankLabel(rank)}
      </div>
      <div className={`text-3xl font-semibold ${colors.center}`}>
        {suitGlyph(suit)}
      </div>
      <div className={`absolute right-1 bottom-1 text-xs opacity-90 ${colors.text}`}>
        {rankLabel(rank)} {suitGlyph(suit)}
      </div>
    </div>
  );
}

function suitClasses(suit: Suit): { text: string; border: string; center: string } {
  switch (suit) {
    case 'H':
    case 'D':
      return { text: 'text-red-700', border: 'border-red-600', center: 'text-red-600' };
    case 'S':
      return { text: 'text-slate-900', border: 'border-slate-800', center: 'text-slate-900' };
    case 'C':
      return { text: 'text-slate-900', border: 'border-slate-800', center: 'text-slate-900' };
    default:
      return { text: 'text-slate-900', border: 'border-slate-400', center: 'text-slate-800' };
  }
}

function rankLabel(rank: Card['rank']): string | number {
  switch (rank as number) {
    case 9:
    case 10:
      return rank as number;
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    case 14:
      return 'A';
    default:
      return rank as number;
  }
}


