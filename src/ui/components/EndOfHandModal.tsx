type Props = {
  open: boolean;
  title: string;
  message: string;
  onNext: () => void;
  details?: {
    makersTeam: 'NS' | 'EW';
    makersWonTricks: number;
    defendersWonTricks: number;
    score: { NS: number; EW: number };
  } | null;
};

export function EndOfHandModal({ open, title, message, onNext, details }: Props) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-[min(520px,92vw)] rounded-xl bg-white p-5 shadow-2xl border">
        <h2 className="text-xl font-bold mb-1 text-slate-900">{title}</h2>
        <p className="text-sm text-slate-700 mb-3">{message}</p>
        {details && (
          <div className="mb-3 grid gap-2 text-sm text-slate-800">
            <div className="rounded-md bg-slate-50 px-2 py-1"><span className="font-semibold">Makers:</span> {details.makersTeam}</div>
            <div className="rounded-md bg-slate-50 px-2 py-1"><span className="font-semibold">Tricks:</span> {details.makersWonTricks} - {details.defendersWonTricks}</div>
            <div className="rounded-md bg-slate-50 px-2 py-1"><span className="font-semibold">Score:</span> NS {details.score.NS} / EW {details.score.EW}</div>
          </div>
        )}
        <div className="flex justify-end">
          <button className="rounded bg-lodge-pine text-white px-4 py-2 shadow hover:shadow-md" onClick={onNext}>Next Hand</button>
        </div>
      </div>
    </div>
  );
}


