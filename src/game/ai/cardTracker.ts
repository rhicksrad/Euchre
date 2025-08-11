import { Card, Suit, Rank } from '../rules/deck';
import { effectiveSuit, isTrump } from '../rules/ordering';

/**
 * Tracks cards that have been played during a hand
 */
export class CardTracker {
  private playedCards: Set<string>;
  private allCards: Set<string>;
  
  constructor() {
    this.playedCards = new Set();
    this.allCards = new Set();
    
    // Initialize with all 24 cards in a euchre deck
    const suits = [Suit.Hearts, Suit.Diamonds, Suit.Spades, Suit.Clubs];
    const ranks = [Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        this.allCards.add(this.cardKey({ suit, rank }));
      }
    }
  }
  
  /**
   * Create a unique key for a card
   */
  private cardKey(card: Card): string {
    return `${card.suit}-${card.rank}`;
  }
  
  /**
   * Mark a card as played
   */
  addPlayedCard(card: Card): void {
    this.playedCards.add(this.cardKey(card));
  }
  
  /**
   * Mark multiple cards as played
   */
  addPlayedCards(cards: Card[]): void {
    cards.forEach(card => this.addPlayedCard(card));
  }
  
  /**
   * Check if a specific card has been played
   */
  hasBeenPlayed(card: Card): boolean {
    return this.playedCards.has(this.cardKey(card));
  }
  
  /**
   * Get all cards that haven't been played yet
   */
  getRemainingCards(): Card[] {
    const remaining: Card[] = [];
    
    this.allCards.forEach(key => {
      if (!this.playedCards.has(key)) {
        const [suit, rank] = key.split('-');
        remaining.push({
          suit: suit as Suit,
          rank: parseInt(rank) as Rank
        });
      }
    });
    
    return remaining;
  }
  
  /**
   * Get remaining cards of a specific suit (accounting for left bower)
   */
  getRemainingInSuit(suit: Suit, trump: Suit): Card[] {
    return this.getRemainingCards().filter(card => 
      effectiveSuit(card, trump) === suit
    );
  }
  
  /**
   * Count remaining cards in each suit
   */
  getSuitCounts(trump: Suit): Record<Suit, number> {
    const counts: Record<Suit, number> = {
      [Suit.Hearts]: 0,
      [Suit.Diamonds]: 0,
      [Suit.Spades]: 0,
      [Suit.Clubs]: 0,
    };
    
    this.getRemainingCards().forEach(card => {
      const suit = effectiveSuit(card, trump);
      counts[suit]++;
    });
    
    return counts;
  }
  
  /**
   * Check if a player is likely void in a suit based on played cards
   * (This would need more context about who played what, simplified for now)
   */
  isLikelyVoid(suit: Suit, trump: Suit): boolean {
    // If very few cards of this suit remain, someone might be void
    const remaining = this.getRemainingInSuit(suit, trump);
    return remaining.length <= 2;
  }
  
  /**
   * Get the highest remaining card in a suit
   */
  getHighestRemaining(suit: Suit, trump: Suit): Card | null {
    const remaining = this.getRemainingInSuit(suit, trump);
    if (remaining.length === 0) return null;
    
    // Sort by rank (accounting for bowers in trump)
    return remaining.sort((a, b) => {
      if (isTrump(a, trump) && isTrump(b, trump)) {
        // Both trump - use special ordering
        // Right bower > left bower > A > K > Q > 10 > 9
        const aIsRight = a.suit === trump && a.rank === Rank.Jack;
        const bIsRight = b.suit === trump && b.rank === Rank.Jack;
        if (aIsRight) return 1;
        if (bIsRight) return -1;
        
        const aIsLeft = a.suit !== trump && a.rank === Rank.Jack;
        const bIsLeft = b.suit !== trump && b.rank === Rank.Jack;
        if (aIsLeft) return 1;
        if (bIsLeft) return -1;
      }
      
      return b.rank - a.rank;
    })[0];
  }
  
  /**
   * Reset the tracker for a new hand
   */
  reset(): void {
    this.playedCards.clear();
  }
  
  /**
   * Get count of played cards
   */
  getPlayedCount(): number {
    return this.playedCards.size;
  }
}
