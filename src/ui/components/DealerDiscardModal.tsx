import { useState, useEffect } from 'react';
import { Card } from '../../game/rules/deck';
import { CardView } from './CardView';
import { CardBack } from './CardBack';
import { useGameStore } from '../../state/store';

type Props = {
  open: boolean;
  cards: readonly Card[];
  onDiscard: (card: Card) => void;
  isPlayer: boolean;
};

export function DealerDiscardModal({ open, cards, onDiscard, isPlayer }: Props) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    if (open) {
      setAnimating(true);
      // When AI is dealer, store logic will trigger discard; UI should not reveal cards or choose.
    }
  }, [open]);

  if (!open) return null;

  const handleDiscard = () => {
    if (selectedCard) {
      onDiscard(selectedCard);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-[min(600px,90vw)] rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isPlayer ? 'Choose a card to discard' : 'Dealer is choosing...'}
        </h2>
        <p className="text-sm text-slate-700 mb-4">
          The dealer picked up the {useGameStore.getState().bidding?.upcardSuit} and must discard one card.
        </p>
        
        {/* Pickup animation */}
        <div className={`mb-4 flex justify-center ${animating ? 'animate-deal' : ''}`}>
          <div className="rounded-lg bg-lodge-felt/20 p-2 border border-lodge-pine/20">
            <span className="text-xs text-slate-600">Picked up from kitty</span>
          </div>
        </div>

        {/* Hand display */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {cards.map((card, idx) => (
            <button
              key={`${card.suit}-${card.rank}-${idx}`}
              onClick={() => isPlayer && setSelectedCard(card)}
              disabled={!isPlayer}
              className={`transition-all ${
                selectedCard?.suit === card.suit && selectedCard?.rank === card.rank
                  ? 'ring-2 ring-lodge-pine transform -translate-y-2'
                  : 'hover:transform hover:-translate-y-1'
              } ${!isPlayer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isPlayer ? <CardView card={card} /> : <CardBack />}
            </button>
          ))}
        </div>

        {isPlayer && (
          <div className="flex justify-center">
            <button
              onClick={handleDiscard}
              disabled={!selectedCard}
              className="rounded-lg bg-lodge-pine text-white px-6 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lodge-pine/90 transition"
            >
              Discard Selected
            </button>
          </div>
        )}

        {!isPlayer && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
