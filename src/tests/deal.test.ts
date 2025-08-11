import { describe, expect, it } from 'vitest';
import { shuffleDeckWithSeed, dealHands } from '../game/deal';

describe('Dealing', () => {
  it('deals 5 cards to each and 4 to kitty', () => {
    const deck = shuffleDeckWithSeed('seed');
    const { hands, kitty } = dealHands(deck, 0);
    expect(kitty.length).toBe(4);
    expect(hands[0].length).toBe(5);
    expect(hands[1].length).toBe(5);
    expect(hands[2].length).toBe(5);
    expect(hands[3].length).toBe(5);
  });
});


