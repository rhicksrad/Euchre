import { Suit } from '../../game/rules/deck';

export function suitGlyph(suit: Suit): string {
  switch (suit) {
    case Suit.Hearts:
      return '♥';
    case Suit.Diamonds:
      return '♦';
    case Suit.Spades:
      return '♠';
    case Suit.Clubs:
      return '♣';
    default:
      return '?';
  }
}


