import { useEffect, useState } from 'react';
import { events } from '../../services/events';
import { useGameStore } from '../../state/store';

export function AriaAnnouncer() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const seatName = (p: 0|1|2|3) => useGameStore.getState().seatName(p);
    const unsubs = [
      events.on('trickWon', (e) => setMsg(`Trick won by ${seatName(e.winner as 0|1|2|3)}`)),
      events.on('handEnd', (e) => setMsg(`Hand over. Makers ${e.makersWonTricks} to ${e.defendersWonTricks}`)),
      events.on('gameEnd', (e) => setMsg(`Game over. ${e.winnerTeam} win`)),
      events.on('bid', (e) => {
        if (e.type === 'order_up') setMsg(`${seatName(e.player)} orders up${e.alone ? ' and goes alone' : ''}`);
        if (e.type === 'pass') setMsg(`${seatName(e.player)} passes`);
        if (e.type === 'name_trump') setMsg(`${seatName(e.player)} names trump${e.alone ? ' and goes alone' : ''}`);
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);
  return (
    <div aria-live="polite" className="sr-only" role="status">{msg}</div>
  );
}


