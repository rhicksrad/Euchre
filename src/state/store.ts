import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Card, Suit } from '../game/rules/deck';
import { shuffleDeckWithSeed, dealHands } from '../game/deal';
import type { BiddingState, Phase, PlayerId } from '../game/types';
import { winningCardIndex } from '../game/rules/trick';
import { scoreHand } from '../game/rules/scoring';
import { isLeftBower, isRightBower, isTrump, effectiveSuit } from '../game/rules/ordering';
import { computeDealerDiscardIndex } from '../game/flow';
import { pickBidRound1 } from '../game/ai/policy';
import { useAppStore } from '../app/providers/state';
import { useAchievements } from './achievements';
import { events } from '../services/events';
import { replay } from '../services/replay';
import type { CharacterId } from '../game/characters';
import { CHAR_BY_ID } from '../game/characters';

type Score = { NS: number; EW: number };

type TrickRecord = {
  trickIndex: number;
  lead: PlayerId;
  winner: PlayerId;
  leadSuit: Suit;
  trump: Suit;
  plays: Array<{ player: PlayerId; card: Card }>;
};

type GameState = {
  seed: string;
  handIndex: number;
  phase: Phase;
  dealer: PlayerId;
  hands: Record<PlayerId, Card[]>;
  kitty: Card[];
  upcard: Card | null;
  bidding: BiddingState | null;
  trump: Suit | null;
  leader: PlayerId | null;
  current: PlayerId | null;
  trick: Card[]; // played in order by current
  tricksWon: { NS: number; EW: number };
  score: Score;
  log: string[];
  seatCharacters: Record<PlayerId, CharacterId | null>;
  dealerPickup: { player: PlayerId; alone: boolean } | null; // Track pending dealer discard
  playedCards: Card[]; // Track all cards played this hand
  trickHistory: TrickRecord[]; // Completed tricks this hand
  startNewHand: () => void;
  startBidding: () => void;
  orderUp: (player: PlayerId, alone?: boolean) => void;
  passBid: (player: PlayerId) => void;
  nameTrump: (player: PlayerId, trump: Suit, alone: boolean) => void;
  playCard: (player: PlayerId, card: Card) => void;
  advanceAI: () => void;
  nextHand: () => void;
  processAIBid: () => void;
  setSeed: (seed: string) => void;
  resetAll: () => void;
  setSeatCharacters: (assign: Record<PlayerId, CharacterId>) => void;
  dealerDiscard: (card: Card) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Helper to show a friendly name for a seat
      seatName(seat: PlayerId): string {
        const id = get().seatCharacters[seat];
        return id ? CHAR_BY_ID[id].name : `Player ${seat}`;
      },
      seed: 'lodge-0001',
      handIndex: 0,
      phase: 'idle',
      dealer: 0,
      hands: { 0: [], 1: [], 2: [], 3: [] },
      kitty: [],
      upcard: null,
      bidding: null,
      trump: null,
      leader: null,
      current: null,
      trick: [],
      tricksWon: { NS: 0, EW: 0 },
      score: { NS: 0, EW: 0 },
      log: [],
      seatCharacters: { 0: null, 1: null, 2: null, 3: null },
      dealerPickup: null,
      playedCards: [],
      trickHistory: [],
      setSeed: (seed) => set({ seed }),
      setSeatCharacters: (assign) => set({ seatCharacters: assign as Record<PlayerId, CharacterId> }),
      resetAll: () => set({
        phase: 'idle',
        dealer: 0,
        hands: { 0: [], 1: [], 2: [], 3: [] },
        kitty: [],
        upcard: null,
        bidding: null,
        trump: null,
        leader: null,
        current: null,
        trick: [],
        tricksWon: { NS: 0, EW: 0 },
        score: { NS: 0, EW: 0 },
        log: [],
        handIndex: 0,
        seatCharacters: { 0: null, 1: null, 2: null, 3: null },
        dealerPickup: null,
        playedCards: [],
        trickHistory: [],
      }),
      startNewHand: () => {
        const { seed, dealer, handIndex } = get();
        const deck = shuffleDeckWithSeed(`${seed}-hand-${handIndex}`);
        const result = dealHands(deck, dealer);
        replay.push({ type: 'start_hand', handIndex, dealer, seed: String(seed) });
        set({
          phase: 'dealing',
          hands: result.hands,
          kitty: result.kitty,
          upcard: result.kitty[0] ?? null,
          trump: null,
          leader: ((dealer + 1) % 4) as PlayerId,
          current: ((dealer + 1) % 4) as PlayerId,
          trick: [],
          tricksWon: { NS: 0, EW: 0 },
          log: [
            ...get().log,
            `Hand #${handIndex + 1} dealt. Dealer: ${get().seatName(dealer)}. First to act: ${get().seatName(((dealer + 1) % 4) as PlayerId)}`,
          ],
          handIndex: handIndex + 1,
          playedCards: [],
          trickHistory: [],
        });
        events.emit('deal', { handIndex, dealer });
        // Automatically start bidding
        get().startBidding();
      },
      startBidding: () => {
        const { dealer, upcard } = get();
        if (!upcard) return;
        const bidding: BiddingState = {
          dealer,
          current: ((dealer + 1) % 4) as PlayerId,
          upcardSuit: upcard.suit as Suit,
          round: 1,
          passes: 0,
          trump: null,
          maker: null,
          makerWentAlone: false,
        };
        set({
          bidding,
          phase: 'bidding1',
          current: bidding.current,
          leader: null,
          log: [
            ...get().log,
            `Bidding starts. Upcard: ${emojiCard(upcard)}. Dealer: ${get().seatName(dealer)}. First to act: ${get().seatName(bidding.current)}`,
          ],
        });
        get().processAIBid();
      },
      orderUp: (player, alone = false) => {
        const { bidding, phase } = get();
        if (!bidding || phase !== 'bidding1') return;
        const state = get();
        const dealer = state.dealer;
        const up = state.upcard;
        if (!up) return; // safety: no upcard available
        
        // Add upcard to dealer's hand
        const dealerHand = [...state.hands[dealer], up];
        const newHands = { ...state.hands, [dealer]: dealerHand } as Record<PlayerId, Card[]>;
        
        // Set pending dealer pickup state
        set({
          hands: newHands,
          upcard: null,
          dealerPickup: { player, alone },
          bidding: { ...bidding, trump: bidding.upcardSuit, maker: player },
          log: [
            ...state.log,
            `${state.seatName(player)} orders up ${suitEmoji(bidding.upcardSuit)}${alone ? ' and goes alone' : ''}. Dealer ${state.seatName(dealer)} will pick up`,
          ],
        });
        
        events.emit('bid', { type: 'order_up', player, suit: String(bidding.upcardSuit), alone });
        replay.push({ type: 'order_up', player, suit: String(bidding.upcardSuit) });
        
        // If dealer is AI, auto-discard after a delay
        if (dealer !== 0) {
          setTimeout(() => {
            const discardIdx = computeDealerDiscardIndex(dealerHand, bidding.upcardSuit);
            get().dealerDiscard(dealerHand[discardIdx]);
          }, 1500);
        }
      },
      dealerDiscard: (card: Card) => {
        const { dealer, bidding, dealerPickup, hands } = get();
        if (!dealerPickup || !bidding) return;
        // Remove the discarded card from dealer's hand
        const dealerHand = hands[dealer].filter((c) => !(c.suit === card.suit && c.rank === card.rank));
        const newHands = { ...hands, [dealer]: dealerHand } as Record<PlayerId, Card[]>;
        // Compute leader/current adjusting for lone partner sitting out
        const partner = ((dealerPickup.player + 2) % 4) as PlayerId;
        let nextLeader = ((dealer + 1) % 4) as PlayerId;
        if (dealerPickup.alone && nextLeader === partner) {
          nextLeader = ((partner + 1) % 4) as PlayerId;
        }
        let nextCurrent = nextLeader;
        set({
          hands: newHands,
          dealerPickup: null,
          bidding: { ...bidding, makerWentAlone: dealerPickup.alone },
          phase: 'playing',
          leader: nextLeader,
          current: nextCurrent,
          trump: (bidding.trump ?? bidding.upcardSuit) as Suit,
          log: [...get().log, `${get().seatName(dealer)} discards ${emojiCard(card)}`],
        });
        // Start AI play if needed
        get().advanceAI();
      },
      passBid: (player: PlayerId) => {
        const { bidding } = get();
        if (!bidding) return;
        if (bidding.current !== player) return;
        const next = ((bidding.current + 1) % 4) as PlayerId;
        const passes = bidding.passes + 1;
        set({ log: [...get().log, `${get().seatName(player)} passes`] });
        if (bidding.round === 1 && passes >= 4) {
          // move to round 2: naming trump (not upcard suit)
          set({
            bidding: { ...bidding, round: 2 as const, current: ((bidding.dealer + 1) % 4) as PlayerId, passes: 0 },
            phase: 'bidding2',
            log: [...get().log, 'All passed round 1. Proceed to round 2 (cannot name upcard suit)'],
          });
          get().processAIBid();
          return;
        }
        if (bidding.round === 2 && passes >= 4) {
          // No trump selected: throw in hand and pass deal to the left
          set({ log: [...get().log, 'No trump selected. Redeal.'], bidding: null, trump: null, upcard: null, trick: [] });
          get().nextHand();
          return;
        }
        set({ bidding: { ...bidding, current: next, passes } });
        events.emit('bid', { type: 'pass', player });
        replay.push({ type: 'pass', player });
        get().processAIBid();
      },
      nameTrump: (player, trump, alone) => {
        const { bidding } = get();
        if (!bidding || bidding.round !== 2) return;
        if (trump === bidding.upcardSuit) return; // invalid in round 2
        // Compute eldest hand (left of dealer) to lead first trick
        const state = get();
        const partner = ((player + 2) % 4) as PlayerId;
        let nextLeader = ((bidding.dealer + 1) % 4) as PlayerId;
        // If maker goes alone and partner would have led, skip them
        if (alone && nextLeader === partner) {
          nextLeader = ((partner + 1) % 4) as PlayerId;
        }
        const nextCurrent = nextLeader;
        set({
          bidding: { ...bidding, trump, maker: player, makerWentAlone: alone },
          trump,
          phase: 'playing',
          leader: nextLeader,
          current: nextCurrent,
            log: [...get().log, `${state.seatName(player)} names ${suitEmoji(trump)}${alone ? ' and goes alone' : ''}`],
        });
        events.emit('bid', { type: 'name_trump', player, suit: trump, alone });
        replay.push({ type: 'name_trump', player, suit: String(trump), alone });
        // If AI leads and it's not player, let AI start
        get().advanceAI();
      },
      playCard: (player, card) => {
        const { current, hands, trick, trump, leader, tricksWon, score, bidding, playedCards } = get();
        if (current !== player || !trump || leader == null || !bidding) return;
        // remove card from hand
        const newHand = hands[player].filter((c) => !(c.suit === card.suit && c.rank === card.rank));
        const newHands = { ...hands, [player]: newHand } as Record<PlayerId, Card[]>;
        const newTrick = [...trick, card];
        const newPlayedCards = [...playedCards, card];
        const partner = bidding.maker != null ? ((bidding.maker + 2) % 4) as PlayerId : null;
        const playersInTrick = bidding.makerWentAlone ? 3 : 4;
        // compute next active player (skip partner when alone)
        function nextActive(p: PlayerId): PlayerId {
          const n = ((p + 1) % 4) as PlayerId;
          if (bidding.makerWentAlone && partner != null && n === partner) return ((n + 1) % 4) as PlayerId;
          return n;
        }
        if (newTrick.length < playersInTrick) {
          set({ hands: newHands, trick: newTrick, current: nextActive(player), playedCards: newPlayedCards });
          replay.push({ type: 'play', player, card: { suit: String(card.suit), rank: Number(card.rank) } });
          events.emit('playCard', { player, suit: String(card.suit), rank: Number(card.rank) });
          // let AI act if needed
          get().advanceAI();
          return;
        }
        // Resolve trick
        const leadSuit = newTrick[0].suit;
        const winnerOffset = winningCardIndex(newTrick, trump);
        // map trick index to seat, skipping partner if alone
        let winner: PlayerId;
        if (bidding.makerWentAlone && partner != null) {
          const order: PlayerId[] = [leader, nextActive(leader as PlayerId), nextActive(nextActive(leader as PlayerId))] as PlayerId[];
          winner = order[winnerOffset];
        } else {
          winner = ((leader + winnerOffset) % 4) as PlayerId;
        }
        const team = winner % 2 === 0 ? 'NS' : 'EW';
        const updatedTricks = { ...tricksWon, [team]: tricksWon[team as 'NS' | 'EW'] + 1 } as { NS: number; EW: number };
        // Achievements: left bower trick
        const last = newTrick[winnerOffset];
        if (isLeftBower(last, trump)) {
          useAchievements.getState().unlock('leftys_best');
        }
        events.emit('trickWon', { winner, winningCard: { suit: last.suit, rank: last.rank }, trump });
        // Build trick history record
        const orderPlayers: PlayerId[] = [];
        {
          let p = leader as PlayerId;
          for (let i = 0; i < newTrick.length; i += 1) {
            orderPlayers.push(p);
            p = nextActive(p);
          }
        }
        const trickIndex = get().trickHistory.length;
        const record: TrickRecord = {
          trickIndex,
          lead: leader as PlayerId,
          winner,
          leadSuit: effectiveSuit(newTrick[0], trump),
          trump,
          plays: newTrick.map((c, i) => ({ player: orderPlayers[i]!, card: c })),
        };

        // clear trick and set next leader/current
        set({
          hands: newHands,
          trick: [],
          leader: winner,
          current: bidding.makerWentAlone && partner != null && nextActive(winner) === partner ? nextActive(nextActive(winner)) : winner,
          tricksWon: updatedTricks,
          playedCards: newPlayedCards,
          trickHistory: [...get().trickHistory, record],
          log: [...get().log, `Trick won by ${get().seatName(winner)} (lead ${suitEmoji(leadSuit)})`],
        });
        // If 5 tricks complete, compute hand scoring
        const totalTricks = updatedTricks.NS + updatedTricks.EW;
        if (totalTricks >= 5) {
          const makersTeam = (bidding.maker! % 2 === 0 ? 'NS' : 'EW') as 'NS' | 'EW';
          const makersWon = updatedTricks[makersTeam];
          const defendersWon = updatedTricks[makersTeam === 'NS' ? 'EW' : 'NS'];
          const points = scoreHand({ makersWonTricks: makersWon, defendersWonTricks: defendersWon, makersWentAlone: bidding.makerWentAlone });
          const addNS = makersTeam === 'NS' ? points.makers : points.defenders;
          const addEW = makersTeam === 'EW' ? points.makers : points.defenders;
          const newScore: Score = { NS: score.NS + addNS, EW: score.EW + addEW };
          const gameEnd = newScore.NS >= 10 || newScore.EW >= 10;
          set({ score: newScore, phase: gameEnd ? 'game_end' : 'hand_end', log: [...get().log, `Hand over: +NS ${addNS}, +EW ${addEW}`] });
          // Achievements
          if (points.makers === 4 && bidding.makerWentAlone) useAchievements.getState().unlock('solo_canoe');
          if (makersWon === 5) useAchievements.getState().unlock('clean_sweep');
          const diff = Math.abs(newScore.NS - newScore.EW);
          if (diff >= 6) useAchievements.getState().unlock('mount_marcy');
          events.emit('handEnd', { makersTeam, makersWonTricks: makersWon, defendersWonTricks: defendersWon, makersWentAlone: bidding.makerWentAlone });
          replay.push({ type: 'hand_end' });
          if (gameEnd) {
            const winnerTeam = newScore.NS >= 10 ? 'NS' : 'EW';
            events.emit('gameEnd', { winnerTeam, score: newScore, difficulty: useAppStore.getState().difficulty });
            useAchievements.getState().unlock('welcome');
          }
          return;
        }
        // Continue next trick with winner leading
        get().advanceAI();
      },
      advanceAI: async () => {
        const s = get();
        // Bidding phases
        if ((s.phase === 'bidding1' || s.phase === 'bidding2') && s.bidding && s.bidding.current !== 0) {
          get().processAIBid();
          return;
        }
        // AI card play
        if (s.phase !== 'playing' || s.current === 0 || s.current == null || s.trump == null || !s.bidding) return;
        const player = s.current as PlayerId;
        const hand = s.hands[player];
        const trick = s.trick;
        
        // Calculate partner (opposite team member)
        const partner = ((player + 2) % 4) as PlayerId;
        const partnerPlayer = s.bidding.makerWentAlone && partner === ((s.bidding.maker! + 2) % 4) ? null : partner;
        
        // Get AI difficulty and pick card
        const difficulty = useAppStore.getState().difficulty;
        const { pickCardToPlay } = await import('../game/ai/policy');
        const card = pickCardToPlay(hand, trick, s.trump, partnerPlayer, s.playedCards, difficulty);
        
        if (!card) return;
        
        // slight delay for UI readability
        setTimeout(() => {
          get().playCard(player, card);
        }, 200);
      },
      processAIBid: async () => {
        const s = get();
        const bidding = s.bidding;
        if (!bidding) return;
        const current = bidding.current;
        if (current === 0) return; // player turn
        const difficulty = useAppStore.getState().difficulty;
        const hand = s.hands[current];
        
        // Calculate position relative to dealer
        const position = ((current - bidding.dealer + 4) % 4) as 0 | 1 | 2 | 3;
        
        if (bidding.round === 1) {
          // Check if this is the last player to act (dealer stuck)
          const isLastToAct = bidding.passes === 3;
          const upcard = s.upcard;
          if (!upcard) return;
          
          const { pickBidRound1 } = await import('../game/ai/policy');
          const decision = pickBidRound1(hand, upcard, position, isLastToAct, difficulty);
          
          setTimeout(() => {
            if (decision.action === 'order') {
              get().orderUp(current, decision.goAlone);
            } else {
              get().passBid(current as PlayerId);
            }
          }, 300);
          return;
        }
        
        // Round 2: name a suit that is not upcard suit
        const isLastToAct = bidding.passes === 3; // Dealer stuck
        const { pickBidRound2 } = await import('../game/ai/policy');
        const decision = pickBidRound2(hand, bidding.upcardSuit, position, isLastToAct, difficulty);
        
        setTimeout(() => {
          if (decision.suit) {
            get().nameTrump(current as PlayerId, decision.suit, decision.goAlone);
          } else {
            get().passBid(current as PlayerId);
          }
        }, 300);
      },
      nextHand: () => {
        const { dealer, phase, score } = get();
        const nextDealer = ((dealer + 1) % 4) as PlayerId;
        // If the previous phase was a completed game, reset the match score
        const resetScore = phase === 'game_end';
        set({ dealer: nextDealer, phase: 'idle', score: resetScore ? { NS: 0, EW: 0 } : score });
        get().startNewHand();
      },
    }),
    {
      name: 'euchre-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        seed: s.seed,
        handIndex: s.handIndex,
        phase: s.phase,
        dealer: s.dealer,
        hands: s.hands,
        kitty: s.kitty,
        upcard: s.upcard,
        bidding: s.bidding,
        trump: s.trump,
        leader: s.leader,
        current: s.current,
        trick: s.trick,
        tricksWon: s.tricksWon,
        score: s.score,
        log: s.log,
        seatCharacters: s.seatCharacters,
      }),
    },
  ),
);

// moved to src/game/flow.ts


// Emoji helpers for logging
function suitEmoji(s: Suit): string {
  switch (s) {
    case Suit.Clubs: return '♣';
    case Suit.Diamonds: return '♦';
    case Suit.Hearts: return '♥';
    case Suit.Spades: return '♠';
    default: return '?';
  }
}

function emojiCard(c: Card): string {
  const rank = c.rank as number;
  const rankStr = rank === 9 || rank === 10 ? String(rank) : rank === 11 ? 'J' : rank === 12 ? 'Q' : rank === 13 ? 'K' : 'A';
  return `${rankStr}${suitEmoji(c.suit as Suit)}`;
}
