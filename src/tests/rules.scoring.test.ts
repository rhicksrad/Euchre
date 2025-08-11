import { describe, expect, it } from 'vitest';
import { scoreHand } from '../game/rules/scoring';

describe('Scoring', () => {
  it('makers 3-4 tricks = 1 point', () => {
    expect(scoreHand({ makersWonTricks: 3, defendersWonTricks: 2, makersWentAlone: false })).toEqual({ makers: 1, defenders: 0 });
    expect(scoreHand({ makersWonTricks: 4, defendersWonTricks: 1, makersWentAlone: false })).toEqual({ makers: 1, defenders: 0 });
  });

  it('makers sweep 5 = 2 points, or 4 points when alone', () => {
    expect(scoreHand({ makersWonTricks: 5, defendersWonTricks: 0, makersWentAlone: false })).toEqual({ makers: 2, defenders: 0 });
    expect(scoreHand({ makersWonTricks: 5, defendersWonTricks: 0, makersWentAlone: true })).toEqual({ makers: 4, defenders: 0 });
  });

  it('defenders euchre makers = 2 points', () => {
    expect(scoreHand({ makersWonTricks: 2, defendersWonTricks: 3, makersWentAlone: false })).toEqual({ makers: 0, defenders: 2 });
  });
});


