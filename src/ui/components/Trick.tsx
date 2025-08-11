import type { Card } from '../../game/rules/deck';
import { suitGlyph } from './handBits';

type TrickProps = {
  cards: readonly Card[];
};

export function Trick({ cards }: TrickProps) {
  return (
    <div className="flex items-center justify-center gap-6" aria-label="Current trick">
      {cards.map((c, i) => (
        <div key={`${c.suit}${c.rank}-${i}`} className="h-24 w-16 rounded-md bg-white border shadow grid place-items-center">
          <span className="text-lg">
            {suitGlyph(c.suit)} {rankLabel(c.rank)}
          </span>
        </div>
      ))}
    </div>
  );
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


