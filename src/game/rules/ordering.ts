import { Card, Rank, Suit } from './deck';

export function suitColor(suit: Suit): 'red' | 'black' {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? 'red' : 'black';
}

export function isRightBower(card: Card, trump: Suit): boolean {
  return card.rank === Rank.Jack && card.suit === trump;
}

export function isLeftBower(card: Card, trump: Suit): boolean {
  return (
    card.rank === Rank.Jack && card.suit !== trump && suitColor(card.suit) === suitColor(trump)
  );
}

export function effectiveSuit(card: Card, trump: Suit): Suit {
  return isLeftBower(card, trump) ? trump : card.suit;
}

export function isTrump(card: Card, trump: Suit): boolean {
  return effectiveSuit(card, trump) === trump;
}

export function compareTrump(a: Card, b: Card, trump: Suit): number {
  // Higher positive => a is stronger; negative => b is stronger
  const score = (c: Card): number => {
    if (!isTrump(c, trump)) return 0;
    if (isRightBower(c, trump)) return 20;
    if (isLeftBower(c, trump)) return 19;
    switch (c.rank) {
      case Rank.Ace:
        return 18;
      case Rank.King:
        return 17;
      case Rank.Queen:
        return 16;
      case Rank.Ten:
        return 15;
      case Rank.Nine:
        return 14;
      case Rank.Jack:
        return 13; // only occurs when card.suit === trump (right bower handled above)
      default:
        return 0;
    }
  };
  return score(a) - score(b);
}

export function compareNonTrumpSameSuit(a: Card, b: Card): number {
  const score = (c: Card): number => {
    switch (c.rank) {
      case Rank.Ace:
        return 6;
      case Rank.King:
        return 5;
      case Rank.Queen:
        return 4;
      case Rank.Jack:
        return 3;
      case Rank.Ten:
        return 2;
      case Rank.Nine:
        return 1;
      default:
        return 0;
    }
  };
  return score(a) - score(b);
}


