import type { Card } from '../rules/deck';
import { Rank, Suit } from '../rules/deck';
import { effectiveSuit, isRightBower, isLeftBower, isTrump } from '../rules/ordering';
import { legalMoves } from '../rules/legal';
import { winningCardIndex } from '../rules/trick';
import { HandEvaluator } from './handEvaluator';
import { CardTracker } from './cardTracker';
import type { PlayerId } from '../types';

export type Difficulty = 'Casual' | 'Standard' | 'Shark';

/**
 * Decide whether to order up in round 1
 */
export function pickBidRound1(
  hand: readonly Card[],
  upcard: Card,
  position: 0 | 1 | 2 | 3,
  isLastToAct: boolean,
  difficulty: Difficulty
): { action: 'order' | 'pass'; goAlone: boolean } {
  // Casual: Simple heuristics
  if (difficulty === 'Casual') {
    const trumpCount = hand.filter((c) => effectiveSuit(c, upcard.suit) === upcard.suit).length;
    const hasRight = hand.some((c) => isRightBower(c, upcard.suit));
    const hasLeft = hand.some((c) => isLeftBower(c, upcard.suit));
    
    if (hasRight || (hasLeft && trumpCount >= 3)) {
      return { action: 'order', goAlone: false };
    }
    if (trumpCount >= 3) {
      return { action: 'order', goAlone: false };
    }
    // No forced trump per rules page (if all pass, hand is thrown in)
    return { action: 'pass', goAlone: false };
  }
  
  // Standard and Shark: Use hand evaluator
  const evaluation = HandEvaluator.shouldOrderUp(hand, upcard, position, isLastToAct);
  
  // Shark is more aggressive about going alone
  if (difficulty === 'Shark' && evaluation.orderUp && !evaluation.goAlone) {
    const score = HandEvaluator.evaluateHand(hand, upcard.suit, position === 0, upcard);
    if (score >= 60) {
      evaluation.goAlone = true;
    }
  }
  
  return {
    action: evaluation.orderUp ? 'order' : 'pass',
    goAlone: evaluation.goAlone
  };
}

/**
 * Decide what to name as trump in round 2
 */
export function pickBidRound2(
  hand: readonly Card[],
  excludeSuit: Suit,
  position: 0 | 1 | 2 | 3,
  isLastToAct: boolean,
  difficulty: Difficulty
): { suit: Suit | null; goAlone: boolean } {
  // Casual: Pick suit with most cards
  if (difficulty === 'Casual') {
    const suits = [Suit.Hearts, Suit.Diamonds, Suit.Spades, Suit.Clubs]
      .filter(s => s !== excludeSuit);
    
    let bestSuit = suits[0];
    let bestCount = 0;
    
    for (const suit of suits) {
      const count = hand.filter(c => effectiveSuit(c, suit) === suit).length;
      if (count > bestCount) {
        bestCount = count;
        bestSuit = suit;
      }
    }
    
  // No forced trump per rules page (if all pass, hand is thrown in)
    
    // Others need 3+ cards
    if (bestCount >= 3) {
      return { suit: bestSuit, goAlone: false };
    }
    
    return { suit: null, goAlone: false };
  }
  
  // Standard and Shark: Use hand evaluator
  const evaluation = HandEvaluator.chooseTrump(hand, excludeSuit, position);
  
  // No forced trump per rules page (if all pass, hand is thrown in)
  
  // Shark is more aggressive
  if (difficulty === 'Shark' && evaluation.suit && !evaluation.goAlone) {
    const score = HandEvaluator.evaluateHand(hand, evaluation.suit);
    if (score >= 55) {
      evaluation.goAlone = true;
    }
  }
  
  return evaluation;
}

/**
 * Pick which card to play during a trick
 */
export function pickCardToPlay(
  hand: readonly Card[],
  trick: readonly Card[],
  trump: Suit,
  partner: PlayerId | null,
  playedCards: readonly Card[],
  difficulty: Difficulty
): Card {
  const leadSuit = trick.length ? effectiveSuit(trick[0], trump) : null;
  const moves = legalMoves(hand, leadSuit, trump);
  
  // Casual: Simple heuristics
  if (difficulty === 'Casual') {
    // If leading, play high non-trump
    if (trick.length === 0) {
      const nonTrump = moves.filter(c => !isTrump(c, trump));
      if (nonTrump.length > 0) {
        // Play highest non-trump
        return nonTrump.reduce((best, card) => 
          card.rank > best.rank ? card : best
        );
      }
    }
    // Otherwise play first legal
    return moves[0];
  }
  
  // Standard and Shark: Smarter play
  
  // Leading
  if (trick.length === 0) {
    // Check if partner called trump (simplified - would need bidding history)
    const partnerLikelyCalledTrump = partner !== null && playedCards.length < 8;
    return pickLead(moves, trump, playedCards, difficulty === 'Shark', partnerLikelyCalledTrump);
  }
  
  // Following
  return pickFollow(moves, trick, trump, partner, playedCards, difficulty === 'Shark');
}

/**
 * Pick card to lead with
 */
function pickLead(
  moves: readonly Card[],
  trump: Suit,
  playedCards: readonly Card[],
  isShark: boolean,
  partnerLikelyCalledTrump: boolean = false
): Card {
  // Create card tracker
  const tracker = new CardTracker();
  tracker.addPlayedCards([...playedCards]);
  
  // If we have right bower, lead it late in the hand
  const rightBower = moves.find(c => isRightBower(c, trump));
  if (rightBower && playedCards.length >= 12) {
    return rightBower;
  }
  
  // PARTNER SIGNAL: Lead back trump if partner likely called it
  const trumpCards = moves.filter(c => isTrump(c, trump));
  if (trumpCards.length > 0 && partnerLikelyCalledTrump) {
    // Lead LOW trump to signal we have support
    const lowTrump = trumpCards.reduce((lowest, card) => {
      if (isRightBower(card, trump)) return lowest;
      if (isLeftBower(card, trump)) return lowest;
      if (isRightBower(lowest, trump)) return card;
      if (isLeftBower(lowest, trump)) return card;
      return card.rank < lowest.rank ? card : lowest;
    });
    
    // Don't lead bower early unless we have to
    if (!isRightBower(lowTrump, trump) && !isLeftBower(lowTrump, trump)) {
      return lowTrump;
    }
  }
  
  // VOID SIGNAL: If we're void in a suit, lead from another short suit
  if (isShark) {
    const suitCounts: Record<Suit, Card[]> = {
      [Suit.Hearts]: [],
      [Suit.Diamonds]: [],
      [Suit.Spades]: [],
      [Suit.Clubs]: [],
    };
    
    moves.forEach(c => {
      if (!isTrump(c, trump)) {
        suitCounts[c.suit].push(c);
      }
    });
    
    // Find voids (we don't have) and singletons
    const voids = Object.entries(suitCounts)
      .filter(([_, cards]) => cards.length === 0)
      .map(([suit]) => suit as Suit);
    
    const singletons = Object.entries(suitCounts)
      .filter(([_, cards]) => cards.length === 1)
      .map(([suit, cards]) => ({ suit: suit as Suit, card: cards[0] }));
    
    // Lead singleton to create void (partner signal)
    if (singletons.length > 0) {
      return singletons[0].card;
    }
  }
  
  // Lead high off-suit cards
  const offSuit = moves.filter(c => !isTrump(c, trump));
  if (offSuit.length > 0) {
    // Lead aces and kings
    const highCards = offSuit.filter(c => c.rank >= Rank.King);
    if (highCards.length > 0) {
      return highCards[0];
    }
    
    // Lead from long suit
    const suitCounts: Record<Suit, number> = {
      [Suit.Hearts]: 0,
      [Suit.Diamonds]: 0,
      [Suit.Spades]: 0,
      [Suit.Clubs]: 0,
    };
    
    offSuit.forEach(c => {
      suitCounts[c.suit]++;
    });
    
    const longestSuit = Object.entries(suitCounts)
      .reduce((best, [suit, count]) => 
        count > best.count ? { suit: suit as Suit, count } : best,
        { suit: Suit.Hearts, count: 0 }
      ).suit;
    
    const fromLongest = offSuit.filter(c => c.suit === longestSuit);
    if (fromLongest.length > 0) {
      return fromLongest[0];
    }
  }
  
  // Default to first move
  return moves[0];
}

/**
 * Pick card to follow with
 */
function pickFollow(
  moves: readonly Card[],
  trick: readonly Card[],
  trump: Suit,
  partner: PlayerId | null,
  playedCards: readonly Card[],
  isShark: boolean
): Card {
  // Create card tracker for smart play
  const tracker = new CardTracker();
  tracker.addPlayedCards([...playedCards]);
  
  // Check if we're currently winning
  const currentWinner = winningCardIndex(trick, trump);
  const partnerWinning = partner !== null && 
    trick.length === 2 && currentWinner === 0; // Partner led and is winning
  
  // If partner is winning, play low (but consider signaling)
  if (partnerWinning) {
    // SIGNAL: If we can't follow suit, discard to show void
    const leadSuit = effectiveSuit(trick[0], trump);
    const mustFollowSuit = moves.some(c => effectiveSuit(c, trump) === leadSuit);
    
    if (!mustFollowSuit && isShark) {
      // We're void - discard from longest remaining suit to signal strength
      const suitCounts: Record<Suit, Card[]> = {
        [Suit.Hearts]: [],
        [Suit.Diamonds]: [],
        [Suit.Spades]: [],
        [Suit.Clubs]: [],
      };
      
      moves.forEach(c => {
        if (!isTrump(c, trump)) {
          suitCounts[c.suit].push(c);
        }
      });
      
      // Find longest suit
      const longestSuit = Object.entries(suitCounts)
        .sort(([_, a], [__, b]) => b.length - a.length)[0];
      
      if (longestSuit && longestSuit[1].length > 0) {
        // Discard lowest from longest suit
        return longestSuit[1].reduce((lowest, card) => 
          card.rank < lowest.rank ? card : lowest
        );
      }
    }
    
    // Default: play lowest card
    return moves.reduce((lowest, card) => {
      const lowerRank = scoreCardForDump(card, trump) < scoreCardForDump(lowest, trump);
      return lowerRank ? card : lowest;
    });
  }
  
  // Try to win the trick
  const winningMoves = moves.filter(card => {
    const testTrick = [...trick, card];
    return winningCardIndex(testTrick, trump) === testTrick.length - 1;
  });
  
  if (winningMoves.length > 0) {
    // For Shark difficulty, check if we need to win with higher card
    if (isShark && trick.length === 3) {
      // Last to play - check if any remaining cards could beat our low winner
      const leadSuit = effectiveSuit(trick[0], trump);
      const remainingInSuit = tracker.getRemainingInSuit(leadSuit, trump);
      
      // If high cards remain that could be played later, win with higher card now
      const highRemaining = remainingInSuit.filter(c => 
        !moves.some(m => m.suit === c.suit && m.rank === c.rank)
      ).filter(c => c.rank >= Rank.King);
      
      if (highRemaining.length > 0) {
        // Win with a higher card to force out opponent's high cards
        const highWinners = winningMoves.filter(c => c.rank >= Rank.Queen);
        if (highWinners.length > 0) {
          return highWinners[0];
        }
      }
    }
    
    // Win with lowest possible card
    return winningMoves.reduce((best, card) => {
      const betterWin = scoreCardForDump(card, trump) < scoreCardForDump(best, trump);
      return betterWin ? card : best;
    });
  }
  
  // Can't win, play lowest card
  return moves.reduce((lowest, card) => {
    const lowerDump = scoreCardForDump(card, trump) < scoreCardForDump(lowest, trump);
    return lowerDump ? card : lowest;
  });
}

/**
 * Score a card for dumping (lower is better to get rid of)
 */
function scoreCardForDump(c: Card, trump: Suit): number {
  // Keep high trump, dump low cards
  if (isRightBower(c, trump)) return 1000;
  if (isLeftBower(c, trump)) return 900;
  if (isTrump(c, trump)) return 100 + (20 - c.rank);
  
  // Keep aces off-suit
  if (c.rank === Rank.Ace) return 80;
  if (c.rank === Rank.King) return 70;
  
  // Dump low cards
  return 20 - c.rank;
}