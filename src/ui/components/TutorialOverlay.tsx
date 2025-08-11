import { useEffect } from 'react';
import { useTutorial } from '../../state/tutorial';

export function TutorialOverlay() {
  const { enabled, step, next, finish } = useTutorial();
  useEffect(() => {
    // no-op hook for potential analytics
  }, [step]);
  if (!enabled || step === 'off' || step === 'done') return null;
  const content = getContent(step);
  return (
    <div className="fixed inset-0 z-[95] pointer-events-none">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="rounded-xl bg-white shadow-lg border p-4 w-[min(720px,92vw)] text-slate-800">
          <div className="font-semibold text-slate-900 mb-1">{content.title}</div>
          <div className="text-sm text-slate-700">{content.body}</div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="rounded border px-3 py-1" onClick={finish}>Dismiss</button>
            <button className="rounded bg-lodge-pine text-white px-3 py-1" onClick={next}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getContent(step: ReturnType<typeof useTutorial.getState>['step']): { title: string; body: string } {
  switch (step) {
    case 'deal':
      return { title: 'Deal a hand', body: 'Press D or click Deal to start. Five cards to each player; the upcard appears in the kitty.' };
    case 'bidding':
      return { title: 'Bidding', body: 'Order up the upcard suit or pass; in round two name a different suit. You can choose to go alone.' };
    case 'playing':
      return { title: 'Play cards', body: 'Follow suit if you can. The left bower counts as trump. Keyboard 1–8 plays a highlighted legal card.' };
    case 'scoring':
      return { title: 'Scoring', body: 'Makers 3–4 tricks: 1 point; a sweep: 2; euchred defenders: 2; a lone sweep: 4. First to 10 wins.' };
    default:
      return { title: 'All set!', body: 'You are ready to play. You can re-enable the tutorial in Settings.' };
  }
}


