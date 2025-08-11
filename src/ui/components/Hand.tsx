import { Card, Suit } from '../../game/rules/deck';
import { CardView } from './CardView';

export type HandProps = {
  label: string;
  cards: readonly Card[];
  onPlay?: (card: Card) => void;
  isInteractive?: boolean;
  allowed?: readonly Card[]; // if provided, only these cards are enabled
  highlight?: readonly Card[]; // cards to visually highlight (e.g., hint)
};

export function Hand({ label, cards, onPlay, isInteractive = false, allowed, highlight }: HandProps) {
  return (
    <div aria-label={label} className="flex gap-2 items-end bg-lodge-parchment p-2 rounded-md shadow-inner text-slate-800">
      {cards.map((c, idx) => (
        // simple card identity check by suit+rank occurrences index
        <button
          key={`${c.suit}${c.rank}-${idx}`}
          type="button"
          className={'relative focus:outline-none focus:ring-2 focus:ring-lodge-lake animate-deal ' + (isInteractive ? 'hover:-translate-y-0.5 transition' : '')}
          onClick={() => onPlay?.(c)}
          disabled={!isInteractive || (allowed && !isCardAllowed(c, allowed))}
          aria-label={`Play ${rankLabel(c.rank)} of ${suitLabel(c.suit)}`}
        >
          <div className={isHighlighted(c, highlight) ? 'ring-4 ring-amber-400 rounded-md' : ''}>
            <CardView card={c} disabled={Boolean(allowed && !isCardAllowed(c, allowed))} />
          </div>
        </button>
      ))}
    </div>
  );
}

function suitLabel(suit: Suit): string {
  switch (suit) {
    case Suit.Hearts:
      return 'hearts';
    case Suit.Diamonds:
      return 'diamonds';
    case Suit.Spades:
      return 'spades';
    case Suit.Clubs:
      return 'clubs';
    default:
      return 'unknown suit';
  }
}

function isCardAllowed(card: Card, allowed: readonly Card[]): boolean {
  return allowed.some((a) => a.suit === card.suit && a.rank === card.rank);
}

function isHighlighted(card: Card, list?: readonly Card[]): boolean {
  if (!list) return false;
  return list.some((a) => a.suit === card.suit && a.rank === card.rank);
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


