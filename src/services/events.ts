// Simple typed event bus for game events used by achievements and UI notifications

export type TrickWonEvent = {
  winner: 0 | 1 | 2 | 3;
  winningCard: { suit: string; rank: number };
  trump: string; // Suit char
};

export type HandEndEvent = {
  makersTeam: 'NS' | 'EW';
  makersWonTricks: number;
  defendersWonTricks: number;
  makersWentAlone: boolean;
};

export type GameEndEvent = {
  winnerTeam: 'NS' | 'EW';
  score: { NS: number; EW: number };
  difficulty: 'Casual' | 'Standard' | 'Shark';
};

export type GameEventMap = {
  trickWon: TrickWonEvent;
  handEnd: HandEndEvent;
  gameEnd: GameEndEvent;
  deal: { handIndex: number; dealer: 0 | 1 | 2 | 3 };
  playCard: { player: 0 | 1 | 2 | 3; suit: string; rank: number };
  bid: { type: 'order_up' | 'name_trump' | 'pass'; player: 0 | 1 | 2 | 3; suit?: string; alone?: boolean };
  uiNewGame: {};
  uiHint: {};
  uiShowHistory: {};
  achievement: { id: string; title: string };
};

type Handler<T> = (payload: T) => void;

class EventBus {
  private handlers: { [K in keyof GameEventMap]?: Set<Handler<GameEventMap[K]>> } = {};

  on<K extends keyof GameEventMap>(type: K, handler: Handler<GameEventMap[K]>): () => void {
    const set = (this.handlers[type] ||= new Set());
    set.add(handler as Handler<GameEventMap[K]>);
    return () => set.delete(handler as Handler<GameEventMap[K]>);
  }

  emit<K extends keyof GameEventMap>(type: K, payload: GameEventMap[K]): void {
    const set = this.handlers[type];
    if (!set) return;
    for (const h of set as Set<Handler<GameEventMap[K]>>) h(payload);
  }
}

export const events = new EventBus();


