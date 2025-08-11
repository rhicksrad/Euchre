import { useEffect, useState } from 'react';
import { events } from '../../services/events';
import { useGameStore } from '../../state/store';
import { useSettings } from '../../state/settings';

export function CaptionBar() {
  const captions = useSettings((s) => s.captions);
  const duration = useSettings((s) => s.captionDurationMs);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!captions) return;
    const seatName = (p: 0|1|2|3) => useGameStore.getState().seatName(p);
    const unsubs = [
      events.on('trickWon', (e) => show(`Trick won by ${seatName(e.winner as 0|1|2|3)}`)),
      events.on('handEnd', (e) => show(`Hand over. Makers ${e.makersWonTricks}-${e.defendersWonTricks}`)),
      events.on('gameEnd', (e) => show(`Game over. ${e.winnerTeam} win (${e.score.NS}-${e.score.EW})`)),
      events.on('bid', (e) => {
        if (e.type === 'order_up') show(`${seatName(e.player as 0|1|2|3)} orders up`);
        if (e.type === 'pass') show(`${seatName(e.player as 0|1|2|3)} passes`);
        if (e.type === 'name_trump') show(`${seatName(e.player as 0|1|2|3)} names trump${e.alone ? ' (alone)' : ''}`);
      }),
      events.on('achievement', (e) => show(`Achievement unlocked: ${e.title}`)),
    ];
    let timer: number | null = null;
    function show(text: string) {
      setMsg(text);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(null), duration) as unknown as number;
    }
    return () => {
      unsubs.forEach((u) => u());
      if (timer) window.clearTimeout(timer);
    };
  }, [captions, duration]);

  if (!captions && !msg) return null;
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
      {msg && <div className="rounded-md bg-black/70 text-white text-sm px-3 py-1 shadow animate-pop" role="status">{msg}</div>}
    </div>
  );
}


