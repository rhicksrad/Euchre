import { Card, Rank, Suit } from '../rules/deck';
import { isLeftBower, isRightBower, isTrump, effectiveSuit } from '../rules/ordering';
import type { PlayerId } from '../types';

/**
 * Evaluates hand strength for bidding decisions
 */
export class HandEvaluator {
  /**
   * Calculate the strength of a hand for a given trump suit
   * Returns a score from 0-100
   */
  static evaluateHand(
    hand: readonly Card[],
    trump: Suit,
    isDealer: boolean = false,
    upcard?: Card
  ): number {
    let score = 0;
    
    // Count trump cards and their strength
    const trumpCards = hand.filter(c => isTrump(c, trump));
    const hasRightBower = hand.some(c => isRightBower(c, trump));
    const hasLeftBower = hand.some(c => isLeftBower(c, trump));
    
    // Right bower is worth 20 points
    if (hasRightBower) score += 20;
    
    // Left bower is worth 15 points
    if (hasLeftBower) score += 15;
    
    // Other trump cards
    trumpCards.forEach(card => {
      if (!isRightBower(card, trump) && !isLeftBower(card, trump)) {
        // Ace of trump: 12 points
        if (card.rank === Rank.Ace) score += 12;
        // King of trump: 8 points
        else if (card.rank === Rank.King) score += 8;
        // Queen of trump: 5 points
        else if (card.rank === Rank.Queen) score += 5;
        // 10 of trump: 3 points
        else if (card.rank === Rank.Ten) score += 3;
        // 9 of trump: 2 points
        else if (card.rank === Rank.Nine) score += 2;
      }
    });
    
    // Count off-suit aces (worth 8 points each)
    const offSuitAces = hand.filter(c => 
      !isTrump(c, trump) && c.rank === Rank.Ace
    );
    score += offSuitAces.length * 8;
    
    // Count off-suit kings (worth 3 points each)
    const offSuitKings = hand.filter(c => 
      !isTrump(c, trump) && c.rank === Rank.King
    );
    score += offSuitKings.length * 3;
    
    // Bonus for having 3+ trump
    if (trumpCards.length >= 3) score += 10;
    if (trumpCards.length >= 4) score += 15;
    
    // Bonus for dealer picking up a good card
    if (isDealer && upcard) {
      if (isRightBower(upcard, trump)) score += 10;
      else if (isLeftBower(upcard, trump)) score += 8;
      else if (upcard.rank === Rank.Ace && isTrump(upcard, trump)) score += 6;
    }
    
    // Penalty for short suits (potential to get euchred)
    const suitCounts = this.countSuits(hand, trump);
    const voids = Object.values(suitCounts).filter(count => count === 0).length;
    const singletons = Object.values(suitCounts).filter(count => count === 1).length;
    
    // Voids can be good if you have trump to ruff
    if (trumpCards.length >= 2) {
      score += voids * 3; // Voids are good with trump
    } else {
      score -= voids * 5; // Voids are bad without trump
    }
    
    score -= singletons * 2; // Singletons are generally bad
    
    return Math.min(100, Math.max(0, score));
  }
  
  /**
   * Evaluate if a hand is strong enough to go alone
   */
  static evaluateLoneHand(hand: readonly Card[], trump: Suit): boolean {
    const score = this.evaluateHand(hand, trump);
    
    // Need very strong hand to go alone (70+ points)
    if (score < 70) return false;
    
    // Must have both bowers or right bower + 2 other trump
    const hasRightBower = hand.some(c => isRightBower(c, trump));
    const hasLeftBower = hand.some(c => isLeftBower(c, trump));
    const trumpCount = hand.filter(c => isTrump(c, trump)).length;
    
    if (hasRightBower && hasLeftBower && trumpCount >= 3) return true;
    if (hasRightBower && trumpCount >= 4) return true;
    
    return false;
  }
  
  /**
   * Count cards in each suit (treating left bower as trump)
   */
  static countSuits(hand: readonly Card[], trump: Suit): Record<Suit, number> {
    const counts: Record<Suit, number> = {
      [Suit.Hearts]: 0,
      [Suit.Diamonds]: 0,
      [Suit.Spades]: 0,
      [Suit.Clubs]: 0,
    };
    
    hand.forEach(card => {
      const suit = effectiveSuit(card, trump);
      counts[suit]++;
    });
    
    return counts;
  }
  
  /**
   * Determine if we should order up based on position
   * @param position - 0: dealer, 1: left of dealer, 2: partner, 3: right of dealer
   */
  static shouldOrderUp(
    hand: readonly Card[],
    upcard: Card,
    position: 0 | 1 | 2 | 3,
    isLastToAct: boolean
  ): { orderUp: boolean; goAlone: boolean } {
    const trump = upcard.suit;
    const isDealer = position === 0;
    const isPartnerDealer = position === 2;
    
    // Evaluate hand strength with this trump
    const score = this.evaluateHand(hand, trump, isDealer, upcard);
    
    // Check for lone hand
    const canGoAlone = this.evaluateLoneHand(
      isDealer ? [...hand, upcard] : hand,
      trump
    );
    
    // Dealer's partner needs stronger hand (don't want to force partner to pick up bad card)
    if (isPartnerDealer) {
      if (canGoAlone) return { orderUp: true, goAlone: true };
      return { orderUp: score >= 45, goAlone: false };
    }
    
    // Dealer: not forced; only order with sufficient strength
    if (isDealer) {
      if (canGoAlone) return { orderUp: true, goAlone: true };
      return { orderUp: score >= 35, goAlone: false };
    }
    
    // Other positions need decent hand
    if (canGoAlone) return { orderUp: true, goAlone: true };
    return { orderUp: score >= 40, goAlone: false };
  }
  
  /**
   * Choose best trump suit for second round of bidding
   */
  static chooseTrump(
    hand: readonly Card[],
    excludeSuit: Suit,
    position: 0 | 1 | 2 | 3
  ): { suit: Suit | null; goAlone: boolean } {
    const suits = [Suit.Hearts, Suit.Diamonds, Suit.Spades, Suit.Clubs]
      .filter(s => s !== excludeSuit);
    
    let bestSuit: Suit | null = null;
    let bestScore = 0;
    let canGoAlone = false;
    
    // Evaluate each possible trump
    for (const suit of suits) {
      const score = this.evaluateHand(hand, suit);
      if (score > bestScore) {
        bestScore = score;
        bestSuit = suit;
        canGoAlone = this.evaluateLoneHand(hand, suit);
      }
    }
    
    // Dealer not forced in round 2; return best suit only if strong enough
    const isDealer = position === 0;
    if (isDealer && bestSuit) {
      return { suit: bestSuit, goAlone: canGoAlone };
    }
    
    // Others need minimum score to bid
    if (bestScore >= 38) {
      return { suit: bestSuit, goAlone: canGoAlone };
    }
    
    return { suit: null, goAlone: false };
  }
}
