import { useState } from 'react';
import { useGameStore } from '../../state/store';
import { Suit } from '../../game/rules/deck';
import { suitGlyph } from './handBits';
import { CHAR_BY_ID } from '../../game/characters';

export function BiddingPanel() {
  const bidding = useGameStore((s) => s.bidding);
  const phase = useGameStore((s) => s.phase);
  const orderUp = useGameStore((s) => s.orderUp);
  const passBid = useGameStore((s) => s.passBid);
  const nameTrump = useGameStore((s) => s.nameTrump);
  const dealer = useGameStore((s) => s.dealer);
  const seatCharacters = useGameStore((s) => s.seatCharacters);
  const yourSeat = 0;
  const [goAlone, setGoAlone] = useState(false);

  if (!bidding || (phase !== 'bidding1' && phase !== 'bidding2')) return null;
  const isYourTurn = bidding.current === yourSeat;
  const label = bidding.round === 1 ? 'Order Up' : 'Name Trump';
  const upcardGlyph = suitGlyph(bidding.upcardSuit);
  const currentName = seatCharacters[bidding.current]
    ? CHAR_BY_ID[seatCharacters[bidding.current]!].name
    : `Player ${bidding.current}`;
  const dealerName = seatCharacters[dealer]
    ? CHAR_BY_ID[seatCharacters[dealer]!].name
    : `Player ${dealer}`;

  return (
    <section className="rounded-xl border bg-lodge-parchment p-3 shadow-sm" aria-labelledby="bidding-title">
      <h2 id="bidding-title" className="font-semibold text-slate-900">Bidding</h2>
      {bidding.round === 1 ? (
        <p className="text-sm text-slate-700">Round 1: {currentName} to order up {upcardGlyph}. Dealer is {dealerName}.</p>
      ) : (
        <p className="text-sm text-slate-700">Round 2: {currentName} to name trump (not {upcardGlyph}). Dealer is {dealerName}.</p>
      )}
      <div className="mt-2 flex gap-2">
        {bidding.round === 1 ? (
          <div className="flex gap-2 items-center">
            <button
              className="rounded bg-lodge-pine text-white px-3 py-1 disabled:opacity-50"
              onClick={() => orderUp(bidding.current, goAlone)}
              disabled={!isYourTurn}
              aria-disabled={!isYourTurn}
              title={!isYourTurn ? 'Waiting for NPC' : 'Order the dealer to pick up'}
            >
              Order Up
            </button>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={goAlone} onChange={(e) => setGoAlone(e.target.checked)} />
              Go alone
            </label>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            <SuitPicker
              exclude={bidding.upcardSuit}
              onPick={(s) => nameTrump(bidding.current, s, goAlone)}
              disabled={!isYourTurn}
            />
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={goAlone} onChange={(e) => setGoAlone(e.target.checked)} />
              Go alone
            </label>
          </div>
        )}
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => passBid(bidding.current)}
          disabled={!isYourTurn}
          aria-disabled={!isYourTurn}
          title={!isYourTurn ? 'Waiting for NPC' : 'Pass this turn'}
        >
          Pass
        </button>
      </div>
    </section>
  );
}

function SuitPicker({ exclude, onPick, disabled }: { exclude: Suit; onPick: (s: Suit) => void; disabled?: boolean }) {
  const suits: Suit[] = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades].filter((s) => s !== exclude);
  return (
    <div className="flex gap-2" role="group" aria-label="Pick trump suit">
      {suits.map((s) => (
        <button
          key={s}
          className={`rounded bg-white border px-2 py-1 text-base disabled:opacity-50 ${suitColorClass(s)}`}
          onClick={() => onPick(s)}
          disabled={disabled}
          aria-label={`Pick ${suitGlyph(s)} as trump`}
          title={`Pick ${suitGlyph(s)} as trump`}
        >
          {suitGlyph(s)}
        </button>
      ))}
    </div>
  );
}

function suitColorClass(suit: Suit): string {
  switch (suit) {
    case Suit.Hearts:
      return 'text-red-600';
    case Suit.Diamonds:
      return 'text-amber-600';
    case Suit.Spades:
      return 'text-slate-800';
    case Suit.Clubs:
      return 'text-green-700';
    default:
      return '';
  }
}


