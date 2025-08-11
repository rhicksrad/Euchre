import { useSettings } from '../../state/settings';

export function HowToOverlay() {
  const show = useSettings((s) => s.showHowTo);
  const setShow = useSettings((s) => s.setShowHowTo);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setShow(false)} />
      <div className="relative z-10 w-[min(620px,92vw)] rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">How to play</h2>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Deal (D), Start Bidding (B), Next Hand (N)</li>
          <li>During your turn, press 1–8 to play the nth legal card</li>
          <li>Goal: first team to 10 points</li>
          <li>Captions and reduced motion can be changed in Settings</li>
        </ul>
        <div className="text-right mt-3">
          <button className="rounded bg-lodge-pine text-white px-3 py-1" onClick={() => setShow(false)}>Got it</button>
        </div>
      </div>
    </div>
  );
}


