export type ReplayAction =
  | { type: 'start_hand'; handIndex: number; dealer: number; seed: string }
  | { type: 'order_up'; player: number; suit: string }
  | { type: 'pass'; player: number }
  | { type: 'name_trump'; player: number; suit: string; alone: boolean }
  | { type: 'play'; player: number; card: { suit: string; rank: number } }
  | { type: 'hand_end' };

class ReplayLogger {
  private actions: ReplayAction[] = [];
  reset(): void {
    this.actions = [];
  }
  push(action: ReplayAction): void {
    this.actions.push(action);
  }
  exportJSON(): string {
    return JSON.stringify({ version: 1, actions: this.actions }, null, 2);
  }
}

export const replay = new ReplayLogger();


