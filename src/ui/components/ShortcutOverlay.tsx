export function ShortcutOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[min(520px,92vw)] rounded-lg bg-white p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Keyboard shortcuts</h2>
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>D: deal a new hand</li>
          <li>B: start bidding</li>
          <li>N: next hand (when hand/game end modal is open)</li>
          <li>1–8: play the nth legal card on your turn</li>
          <li>?: toggle this overlay</li>
        </ul>
        <div className="text-right mt-3">
          <button className="rounded border px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


