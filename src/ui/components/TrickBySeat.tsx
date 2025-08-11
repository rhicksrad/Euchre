import type { Card } from '../../game/rules/deck';
import { useEffect, useState } from 'react';
import { events } from '../../services/events';
import { CardView } from './CardView';
import { useSettings } from '../../state/settings';

type Props = {
  leader: 0 | 1 | 2 | 3 | null;
  trick: readonly Card[];
};

// Align trick cards in a neat horizontal row near the bottom of the felt.
// We position by play index (0..3) so cards always lay out evenly regardless of leader.
const indexPos: Record<0 | 1 | 2 | 3, { position: string; animation: string }> = {
  0: { position: 'bottom-2 left-[calc(50%-135px)]', animation: 'animate-slide-bottom' },
  1: { position: 'bottom-2 left-[calc(50%-45px)]', animation: 'animate-slide-bottom' },
  2: { position: 'bottom-2 left-[calc(50%+45px)]', animation: 'animate-slide-bottom' },
  3: { position: 'bottom-2 left-[calc(50%+135px)]', animation: 'animate-slide-bottom' },
};

export function TrickBySeat({ leader, trick }: Props) {
  const [flashSeat, setFlashSeat] = useState<0 | 1 | 2 | 3 | null>(null);
  const [animatedCards, setAnimatedCards] = useState<Set<string>>(new Set());
  const reducedMotion = useSettings((s) => s.reducedMotion);
  
  useEffect(() => {
    const off = events.on('trickWon', ({ winner }) => {
      if (leader == null) return;
      setFlashSeat(winner);
      setTimeout(() => {
        setFlashSeat(null);
        // Clear trick animation state when trick is cleared
        setAnimatedCards(new Set());
      }, 500);
    });
    return () => off();
  }, [leader]);
  
  // Track which cards have been animated
  useEffect(() => {
    if (trick.length > 0) {
      const lastCard = trick[trick.length - 1];
      const cardKey = `${lastCard.suit}${lastCard.rank}`;
      if (!animatedCards.has(cardKey)) {
        setAnimatedCards(prev => new Set([...prev, cardKey]));
      }
    }
  }, [trick]);
  
  if (leader == null) return null;
  
  return (
    <div className="relative w-full h-full">
      {trick.map((c, i) => {
        const seat = (((leader + i) % 4) as 0 | 1 | 2 | 3);
        const isWinner = flashSeat === seat;
        const cardKey = `${c.suit}${c.rank}`;
        const isNewCard = animatedCards.has(cardKey) && i === trick.length - 1;
        const { position, animation } = indexPos[i as 0 | 1 | 2 | 3];
        
        return (
          <div 
            key={`${cardKey}-${i}`} 
            className={`absolute ${position} transition-all duration-300`}
            style={{ zIndex: i + 1 }}
          >
            <div 
              className={`
                ${isNewCard && !reducedMotion ? animation : ''}
                ${isWinner ? 'animate-trick-win' : ''}
                transform-gpu
              `}
            >
              <div className={`
                ${isWinner ? 'ring-4 ring-yellow-400 shadow-2xl' : 'shadow-lg'}
                rounded-lg overflow-hidden transition-all duration-300 bg-white
              `}>
                <CardView card={c} compact />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}