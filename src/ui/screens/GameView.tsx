import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from '../components/Table';
import { ScoreKitty } from '../components/ScoreKitty';
import { GameLog } from '../components/GameLog';
import { Hand } from '../components/Hand';
import { TrickBySeat } from '../components/TrickBySeat';
import { CardBack } from '../components/CardBack';
import { BiddingPanel } from '../components/BiddingPanel';
import { CardView } from '../components/CardView';
import { Suit, type Card } from '../../game/rules/deck';
import { useGameStore } from '../../state/store';
// Bidding controls are rendered inside the player's action bar now
import { legalMoves } from '../../game/rules/legal';
import { effectiveSuit, isTrump } from '../../game/rules/ordering';
import { winningCardIndex } from '../../game/rules/trick';
// Trump indicator is shown directly on the felt overlay
import { suitGlyph } from '../components/handBits';
import { EndOfHandModal } from '../components/EndOfHandModal';
import { AriaAnnouncer } from '../components/AriaAnnouncer';
import { ShortcutOverlay } from '../components/ShortcutOverlay';
import { DealerBadge } from '../components/DealerBadge';
import { SeatAvatar } from '../components/SeatAvatar';
import { GameLog } from '../components/GameLog';
import { DealerDiscardModal } from '../components/DealerDiscardModal';
import { VictoryCelebration } from '../components/VictoryCelebration';
import { CHARACTERS, CHAR_BY_ID, type CharacterId } from '../../game/characters';
import { shallow } from 'zustand/shallow';
import { useAppStore } from '../../app/providers/state';
import { useAppStore } from '../../app/providers/state';
import { PRNG } from '../../utils/prng';

export function GameView() {
  const upcard = useGameStore((s) => s.upcard);
  const startNewHand = useGameStore((s) => s.startNewHand);
  const resetAll = useGameStore((s) => s.resetAll);
  const startBidding = useGameStore((s) => s.startBidding);
  const playCard = useGameStore((s) => s.playCard);
  const nextHand = useGameStore((s) => s.nextHand);
  const phase = useGameStore((s) => s.phase);
  const { trump, trick, current, leader } = useGameStore(
    (s) => ({ trump: s.trump, trick: s.trick, current: s.current, leader: s.leader }),
    shallow,
  );
  const dealer = useGameStore((s) => s.dealer);
  const bidding = useGameStore((s) => s.bidding);
  const seatCharacters = useGameStore((s) => s.seatCharacters);
  const advanceAI = useGameStore((s) => s.advanceAI);
  const processAIBid = useGameStore((s) => s.processAIBid);
  const dealerPickup = useGameStore((s) => s.dealerPickup);
  const dealerDiscard = useGameStore((s) => s.dealerDiscard);
  const hands = useGameStore((s) => s.hands);
  const score = useGameStore((s) => s.score);
  const setSeatCharacters = useGameStore((s) => s.setSeatCharacters);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const onPlayCard = useCallback((c: Card) => useGameStore.getState().playCard(0, c), []);
  const seed = useAppStore((s) => s.seed);

  // Expose small helpers for top-menu actions when on Game route
  useEffect(() => {
    return () => {};
  }, []);

  // Show celebration when game ends
  useEffect(() => {
    if (phase === 'game_end' && !showCelebration) {
      setShowCelebration(true);
    }
  }, [phase, showCelebration]);

  // Auto-assign characters for all seats if none were chosen on Start
  useEffect(() => {
    const currentSeats = useGameStore.getState().seatCharacters;
    const needAssign = [0,1,2,3].some((p) => !currentSeats[p as 0|1|2|3]);
    if (!needAssign) return;
    const prng = new PRNG(`${seed}-auto-chars`);
    const pool = [...CHARACTERS];
    prng.shuffleInPlace(pool);
    const assign: Record<0|1|2|3, (typeof CHARACTERS)[number]['id']> = {
      0: pool[0]!.id,
      1: pool[1]!.id,
      2: pool[2]!.id,
      3: pool[3]!.id,
    };
    setSeatCharacters(assign as unknown as Record<0|1|2|3, CharacterId>);
  }, [seed, setSeatCharacters]);

  // Auto-deal on first mount if idle and no cards yet
  useEffect(() => {
    const s = useGameStore.getState();
    const noHand = (s.hands[0]?.length ?? 0) === 0 && (s.hands[1]?.length ?? 0) === 0;
    if (s.phase === 'idle' && noHand) {
      startNewHand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts: 1-8 plays allowed card by index; D=deal, B=bidding, N=next hand (when modal)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key.toLowerCase() === 'd') {
        startNewHand();
        return;
      }
      if (e.key.toLowerCase() === 'b') {
        startBidding();
        return;
      }
      if (e.key.toLowerCase() === 'n' && (phase === 'hand_end' || phase === 'game_end')) {
        nextHand();
        return;
      }
      if (e.key === '?') {
        setShowShortcuts((v) => !v);
        return;
      }
      const num = Number(e.key);
      if (!Number.isNaN(num) && num >= 1 && num <= 8) {
        const s = useGameStore.getState();
        if (!s) return;
        const hand0 = s.hands?.[0] ?? [];
        if (s.current !== 0 || !s.trump) return;
        const allowed = legalMoves(
          hand0,
          s.trick.length ? effectiveSuit(s.trick[0], s.trump) : null,
          s.trump,
        );
        const pick = allowed[num - 1];
        if (pick) s.playCard(0 as 0 | 1 | 2 | 3, pick);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, nextHand, startBidding, startNewHand]);
  return (
    <div className="grid gap-3 text-slate-100">
      {/* Header controls moved to the global top bar; remove old per-view bar */}
      <AriaAnnouncer />
      <Table
        top={<Seat
          compact
          charId={seatCharacters[2]}
          label={seatCharacters[2] ? CHAR_BY_ID[seatCharacters[2]!].name : 'AI North'}
          isDealer={dealer === 2}
          isCurrent={(phase === 'bidding1' || phase === 'bidding2') ? bidding?.current === 2 : current === 2}
          backsCount={(hands[2]?.length ?? 0)}
          center
        />}
        left={<Seat
          compact
          charId={seatCharacters[1]}
          label={seatCharacters[1] ? CHAR_BY_ID[seatCharacters[1]!].name : 'AI West'}
          isDealer={dealer === 1}
          isCurrent={(phase === 'bidding1' || phase === 'bidding2') ? bidding?.current === 1 : current === 1}
          backsCount={(hands[1]?.length ?? 0)}
        />}
        right={<Seat
          compact
          charId={seatCharacters[3]}
          label={seatCharacters[3] ? CHAR_BY_ID[seatCharacters[3]!].name : 'AI East'}
          isDealer={dealer === 3}
          isCurrent={(phase === 'bidding1' || phase === 'bidding2') ? bidding?.current === 3 : current === 3}
          backsCount={(hands[3]?.length ?? 0)}
        />}
        bottom={<PlayerSeat trump={trump} trick={trick} handsIndex0Selector={(s) => s.hands[0] ?? []} onPlay={onPlayCard} current={current} />}
        felt={<FeltArea upcard={upcard ?? undefined} trick={trick} leader={leader} trump={trump} alone={Boolean(bidding?.makerWentAlone)} />}
        rightTop={<div className="panel-theme"><LiveScore /></div>}
        leftBottom={<div className="panel-theme"><LiveScore /></div>}
        rightBottom={<div className="panel-theme"><LiveLog /></div>}
      />
      <DealerDiscardModal
        open={dealerPickup !== null}
        cards={dealerPickup ? hands[dealer] : []}
        onDiscard={dealerDiscard}
        isPlayer={dealer === 0}
      />
      {showCelebration && phase === 'game_end' && (
        <VictoryCelebration
          winnerTeam={score.NS >= 10 ? 'NS' : 'EW'}
          score={score}
          onNewGame={() => {
            setShowCelebration(false);
            nextHand(); // Start new game
          }}
        />
      )}
      <EndOfHandModal
        open={(phase === 'hand_end' || (phase === 'game_end' && !showCelebration))}
        title={phase === 'game_end' ? 'Game Over' : 'Hand Complete'}
        message={phase === 'game_end' ? 'A team reached 10 points.' : 'Ready for the next deal?'}
        details={bidding && (phase === 'hand_end' || phase === 'game_end') ? {
          makersTeam: (bidding.maker! % 2 === 0 ? 'NS' : 'EW'),
          makersWonTricks: useGameStore.getState().tricksWon[(bidding.maker! % 2 === 0 ? 'NS' : 'EW')],
          defendersWonTricks: useGameStore.getState().tricksWon[(bidding.maker! % 2 === 0 ? 'EW' : 'NS')],
          score: useGameStore.getState().score,
        } : null}
        onNext={() => nextHand()}
      />
      <ShortcutOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}

function Seat({ label, isDealer, isCurrent, charId, compact = false, backsCount = 0, center = false }: { label: string; isDealer?: boolean; isCurrent?: boolean; charId?: CharacterId | null; compact?: boolean; backsCount?: number; center?: boolean }) {
  return (
    <div className={`rounded-md border bg-lodge-parchment p-3 text-sm text-slate-800 min-h-[140px] ${center ? 'flex flex-col items-center justify-center text-center' : ''}` }>
      <div className={`font-medium flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
        <SeatAvatar id={charId ?? null} />
        <span className="truncate max-w-[10rem] text-slate-900">{label}</span>
        {isDealer && <DealerBadge />}
        {isCurrent && <span className="rounded-full bg-lake-200 text-lake-900 text-[10px] px-2 py-0.5">Turn</span>}
      </div>
      {backsCount > 0 && (
        <div className={`mt-1 grid grid-flow-col auto-cols-max gap-1 ${center ? 'justify-center' : ''}`}>
          {Array.from({ length: backsCount }).map((_, i) => (
            <CardBack key={i} compact={true} />
          ))}
        </div>
      )}
    </div>
  );
}

type HandSliceSelector = (s: ReturnType<typeof useGameStore.getState>) => Card[];

function PlayerSeat({ trump, trick, current, handsIndex0Selector, onPlay, highlight }: { trump: Suit | null; trick: Card[]; current: 0|1|2|3 | null; handsIndex0Selector: HandSliceSelector; onPlay: (c: Card) => void; highlight?: readonly Card[] }) {
  const cards = useGameStore(handsIndex0Selector, shallow);
  const isTurn = current === 0;
  const allowed = useMemo(() => {
    if (!trump) return cards;
    const lead = trick.length ? effectiveSuit(trick[0], trump) : null;
    return legalMoves(cards, lead, trump);
  }, [cards, trick, trump]);
  const myChar = useGameStore((s) => s.seatCharacters[0]);
  const myLabel = myChar ? CHAR_BY_ID[myChar].name : 'You';
  const isDealer = useGameStore((s) => s.dealer === 0);
  const difficulty = useAppStore((s) => s.difficulty);
  const playedCards = useGameStore((s) => s.playedCards);
  const bidding = useGameStore((s) => s.bidding);
  const [suggested, setSuggested] = useState<Card | null>(null);
  const [suggestedWhy, setSuggestedWhy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function compute() {
      if (!isTurn || !trump || difficulty !== 'Casual') { setSuggested(null); setSuggestedWhy(null); return; }
      const { pickCardToPlay } = await import('../../game/ai/policy');
      const partner = bidding?.makerWentAlone ? null : (2 as 0|1|2|3);
      const best = pickCardToPlay(cards, trick, trump, partner, playedCards, 'Standard');
      if (!cancelled) {
        setSuggested(best ?? null);
        setSuggestedWhy(best ? explainChoice(best, { cards, trick, trump }) : null);
      }
    }
    compute();
    return () => { cancelled = true; };
  }, [isTurn, trump, cards, trick, difficulty, playedCards, bidding?.makerWentAlone]);

  const highlightCards = useMemo(() => {
    const combined: Card[] = [];
    if (highlight && highlight.length) combined.push(...highlight);
    if (suggested) combined.push(suggested);
    return combined;
  }, [highlight, suggested]);
  return (
    <div className="rounded-md border bg-lodge-parchment p-3 text-slate-800">
      <div className="font-semibold mb-2 flex items-center gap-2 text-slate-900"><SeatAvatar id={myChar ?? null} /><span>{myLabel}</span>{isDealer && <DealerBadge />}</div>
      {difficulty === 'Casual' && isTurn && suggested && (
        <div className="mb-2 text-xs text-slate-700">
          Helper: Recommended play is <strong className="text-slate-900">{cardLabel(suggested)}</strong>
          {suggestedWhy && <span className="ml-1 text-slate-600">— {suggestedWhy}</span>}
        </div>
      )}
      <Hand label={`${myLabel}'s hand`} cards={cards} isInteractive={isTurn} allowed={allowed} onPlay={(c) => isTurn && onPlay(c)} highlight={highlightCards} />
      <div className="mt-2">
        <BiddingPanel />
      </div>
    </div>
  );
}

function cardLabel(card: Card): string {
  const rank = card.rank as number;
  const rankStr = rank === 9 || rank === 10 ? String(rank) : rank === 11 ? 'J' : rank === 12 ? 'Q' : rank === 13 ? 'K' : 'A';
  const suitMap: Record<number, string> = { 0: '♣', 1: '♦', 2: '♥', 3: '♠' } as unknown as Record<Suit, string>;
  return `${rankStr}${suitMap[card.suit as unknown as number] ?? ''}`;
}

function explainChoice(best: Card, ctx: { cards: readonly Card[]; trick: readonly Card[]; trump: Suit }): string {
  const { cards, trick, trump } = ctx;
  const lead = trick.length ? effectiveSuit(trick[0], trump) : null;
  // Leading: prefer high off-suit, otherwise low trump
  if (trick.length === 0) {
    if (!isTrump(best, trump)) return 'lead a strong non-trump to draw out high cards';
    return 'lead a safe trump to pressure opponents';
  }
  // Following: if we can win the trick, explain why
  const idxIfPlayedLast = winningCardIndex([...trick, best], trump);
  if (idxIfPlayedLast === trick.length) {
    if (isTrump(best, trump) && (!lead || lead !== trump)) return 'ruff (use trump) to win the trick';
    if (isTrump(best, trump)) return 'play the lowest trump that still wins';
    return 'play the lowest card that still wins the trick';
  }
  // Cannot win: dump low or signal void
  if (lead && cards.every((c) => effectiveSuit(c, trump) !== lead)) {
    return 'discard off-suit to signal a void';
  }
  return 'keep higher cards; discard a low card';
}

function FeltArea({ upcard, trick, leader, trump, alone }: { upcard?: Card; trick: readonly Card[]; leader: 0 | 1 | 2 | 3 | null; trump: Suit | null; alone: boolean }) {
  const difficulty = useAppStore((s) => s.difficulty);
  // Felt background is provided by Table; render only trick and upcard layer here
  return (
    <div className="relative w-full">
      <div className="relative w-[66%] mx-auto h-[130px]">
        {trump && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-black/40 text-white text-sm px-2 py-1 flex items-center gap-1" aria-label="Trump on felt">
            <span className="opacity-80">Trump</span>
            <span className="text-base">{suitGlyph(trump)}</span>
            {alone && <span className="ml-1 text-[10px] bg-white/20 px-1 rounded">Lone</span>}
          </div>
        )}
        <div className="absolute right-2 top-2 z-10 rounded-md bg-black/40 text-white text-xs px-2 py-1" aria-label="Difficulty">
          {difficulty} mode
        </div>
        <TrickBySeat leader={leader} trick={trick} />
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 min-h-[40px] text-white">
        {upcard ? (
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-sm">Upcard</span>
            <CardView card={upcard} compact />
          </div>
        ) : (
          <span className="text-sm text-white/60">&nbsp;</span>
        )}
      </div>
    </div>
  );
}

function LiveScore() {
  const score = useGameStore((s) => s.score);
  return (
    <div className="grid gap-4">
      <ScoreKitty teamLabel="Team North/South" score={score.NS} />
      <ScoreKitty teamLabel="Team East/West" score={score.EW} />
    </div>
  );
}

function LiveLog() {
  const log = useGameStore((s) => s.log);
  const lines = log.length ? log : ["Welcome to the lodge.", "A cozy table is ready."];
  return <GameLog lines={lines} />;
}



