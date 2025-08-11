import { useEffect } from 'react';
import { useGameStore } from '../../state/store';

export function RehydrateEffect() {
  const phase = useGameStore((s) => s.phase);
  const bidding = useGameStore((s) => s.bidding);
  const current = useGameStore((s) => s.current);
  const advanceAI = useGameStore((s) => s.advanceAI);
  const processAIBid = useGameStore((s) => s.processAIBid);

  useEffect(() => {
    if (phase === 'playing' && current !== 0 && current != null) {
      advanceAI();
    } else if ((phase === 'bidding1' || phase === 'bidding2') && bidding && bidding.current !== 0) {
      processAIBid();
    }
  }, [phase, current, bidding, advanceAI, processAIBid]);

  return null;
}


