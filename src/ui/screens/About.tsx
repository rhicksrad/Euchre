import { MountainIcon, PineIcon, CanoeIcon, CompassIcon, CampfireIcon } from '../assets/lodgeIcons';

export function About() {
  return (
    <section className="mx-auto max-w-5xl grid gap-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 text-slate-900">
          <MountainIcon />
          <h1 className="text-3xl font-bold tracking-tight">About</h1>
        </div>
        <p className="mt-2 text-slate-700">
          Euchre in the Adirondacks is an accessible, seed‑reproducible Euchre game with a lodge theme.
          Below is a concise rules reference and handy shortcuts.
        </p>
        <div className="mt-3 flex items-center gap-3 text-slate-700">
          <PineIcon /> <CanoeIcon /> <CompassIcon /> <CampfireIcon />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm text-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">How to play</h2>
          {Section({ title: 'Players and cards', children: (
            <>Four players in two teams sit opposite. A 24‑card deck (9–A) is used. The trump Jack is the right bower (highest); the Jack of the same color is the left bower (second‑highest) and counts as trump.</>
          ) })}
          {Section({ title: 'Deal', children: (
            <>Deal and play are clockwise. Five cards are dealt in two rounds (3‑then‑2 or 2‑then‑3) consistently for the session. The remaining four cards form the kitty; the top card is the upcard.</>
          ) })}
          {Section({ title: 'Making trump', children: (
            <>Starting left of the dealer, players may pass or accept the upcard suit as trump. If all pass, a second round allows naming a different suit. If all pass again, the hand is thrown in and deal passes left. When trumps are chosen, J of trump = right bower, J of same color = left bower. Example: J♠ (right), J♣ (left), A♠, K♠, Q♠, 10♠, 9♠.</>
          ) })}
          {Section({ title: 'Going alone', children: (
            <>The player who fixes trump may declare “alone” and play without their partner; the partner sits out.</>
          ) })}
          {Section({ title: 'Play', children: (
            <>Eldest hand leads. Players must follow suit if able; otherwise any card may be played. The left bower counts as trump suit for following.</>
          ) })}
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm text-slate-800 grid gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Scoring</h2>
            <ul className="space-y-1 text-sm">
              <li><ScoreBadge>1</ScoreBadge> Makers win 3 or 4 tricks</li>
              <li><ScoreBadge>2</ScoreBadge> Makers sweep 5 (march)</li>
              <li><ScoreBadge>1</ScoreBadge> Bidder goes alone and wins 3 or 4 tricks</li>
              <li><ScoreBadge>4</ScoreBadge> Bidder goes alone and sweeps 5 (march)</li>
              <li><ScoreBadge className="bg-red-100 text-red-800 border-red-200">2</ScoreBadge> Defenders win 3+ (euchre)</li>
            </ul>
            <p className="mt-2 text-xs text-slate-600">First team to 10 points wins.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Keyboard shortcuts</h2>
            <ul className="text-sm grid grid-cols-2 gap-y-1">
              <li><Kbd>D</Kbd> Deal a new hand</li>
              <li><Kbd>B</Kbd> Start bidding</li>
              <li><Kbd>N</Kbd> Next hand</li>
              <li><span className="font-mono">1–8</span> Play nth legal card</li>
              <li><Kbd>?</Kbd> Toggle shortcuts overlay</li>
            </ul>
          </div>
          <div className="text-xs text-slate-600">Version: {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}</div>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="text-sm leading-6 mt-1">{children}</p>
    </div>
  );
}

function ScoreBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-sm border px-1 text-xs ${className || 'bg-lake-200 text-lake-900 border-lake-300/60'}`}>
      {children}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border bg-white px-1 py-[1px] font-mono text-[11px] text-slate-800">{children}</kbd>
  );
}


