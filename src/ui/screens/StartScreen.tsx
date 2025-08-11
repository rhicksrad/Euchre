import { Link, useNavigate } from 'react-router-dom';
import { useTutorial } from '../../state/tutorial';
import { CanoeIcon as Canoe, PineIcon as Pine, CompassIcon as Compass, MountainIcon as Mountain } from '../assets/lodgeIcons';
import { getSavedGamePhase } from '../../services/saveInfo';
import { getDailyChallenge } from '../../services/daily';
import { CHARACTERS } from '../../game/characters';

export function StartScreen() {
  const nav = useNavigate();
  const savedPhase = getSavedGamePhase();
  const tut = useTutorial();
  const daily = getDailyChallenge();
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  return (
    <section className="relative isolate mx-auto max-w-6xl grid grid-rows-[auto_1fr_auto] gap-8 min-h-[80vh] justify-center text-center">
      <StartBackground />
      {/* subtle grain overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-10 bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:3px_3px]" />
      {/* Hero */}
      <div className="relative z-20 overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-md p-10 shadow-2xl text-center row-start-1 place-self-center mt-4">
        <div className="absolute -top-16 -right-20 w-96 h-96 rounded-full bg-lake-200 blur-3xl opacity-40 pointer-events-none" />
        <div className="flex items-center gap-3 justify-center">
          <Mountain className="w-7 h-7 text-lake-200" />
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-white to-amber-200 bg-clip-text text-transparent animate-shimmer">Euchre in the Adirondacks</h1>
        </div>
        <p className="max-w-prose mt-2 text-slate-700">A cozy lodge table awaits. Choose your character, adjust settings, check achievements, or read about the rules before you play.</p>
        <div className="mt-6 grid gap-3">
          <button className="group relative rounded-xl bg-lodge-pine text-white px-6 py-3 shadow-xl hover:shadow-2xl transition overflow-hidden" onClick={() => nav('/start/characters')}>
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
          </button>
          {savedPhase && (
            <button className="group relative rounded-xl bg-lodge-pine text-white px-6 py-3 shadow-xl hover:shadow-2xl transition overflow-hidden" onClick={() => nav('/game')}>
              <span className="relative z-10">Continue ({savedPhase})</span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </button>
          )}
          {!savedPhase && (
            <button className="rounded-xl border px-4 py-3 shadow hover:shadow-md transition bg-white/70" onClick={() => { tut.start(); nav('/game'); }}>Start Tutorial</button>
          )}
        </div>
        <CharacterShowcase />
      </div>

      {/* Action buttons, centered and sized to content */}
      <div className="relative z-20 flex flex-wrap justify-center items-center gap-3 row-start-3 place-self-center mb-14">
        <ActionBtn title="Character Select" description="Pick your player and meet the lodge regulars." onClick={() => nav('/start/characters')} icon={<Mountain />} />
        <ActionBtn title="Settings" description="Accessibility, input, and display options." onClick={() => nav('/settings')} icon={<Compass />} />
        <ActionBtn title="Achievements" description="Track progress and unlocks." onClick={() => nav('/achievements')} icon={<Pine />} />
        <ActionBtn title="About" description="Rules, credits, and version info." onClick={() => nav('/about')} icon={<Canoe />} />
        <ActionBtn title="Daily Challenge" description={daily.description} onClick={() => nav('/daily')} icon={<Mountain />} badge={`Seed ${daily.id}`} />
      </div>
    </section>
  );
}

function StartBackground() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3b2c"/>
          <stop offset="100%" stopColor="#0a251b"/>
        </linearGradient>
        <linearGradient id="fireGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,200,120,0.6)"/>
          <stop offset="100%" stopColor="rgba(255,140,60,0.0)"/>
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="1440" height="900" fill="url(#sky)" />
      {/* Lake reflection gradient beneath */}
      <rect x="0" y="620" width="1440" height="280" fill="rgba(0,0,0,0.15)" />
      {/* Mountains */}
      <path d="M0 620 L180 520 L320 600 L480 480 L660 600 L820 520 L980 580 L1140 500 L1300 560 L1440 520 L1440 900 L0 900 Z" fill="#0d2f23" />
      <path d="M0 650 L220 560 L380 620 L540 520 L720 630 L900 560 L1060 620 L1240 540 L1440 580 L1440 900 L0 900 Z" fill="#134234" />
      {/* Cabin */}
      <g transform="translate(720,520)">
        <rect x="-60" y="0" width="120" height="70" fill="#5b3b27" stroke="#2e1f16" strokeWidth="3" />
        <rect x="-75" y="-20" width="150" height="20" fill="#4a2d1f" />
        <polygon points="-75,-20 75,-20 0,-80" fill="#3a2419" />
        {/* Door */}
        <rect x="-10" y="25" width="25" height="45" fill="#2e1f16" />
        {/* Windows with warm light */}
        <rect x="-45" y="20" width="25" height="20" fill="#ffd27a" filter="url(#softGlow)" />
        <rect x="20" y="20" width="25" height="20" fill="#ffd27a" filter="url(#softGlow)" />
        {/* Smoke */}
        <g fill="#cbd5e1" opacity="0.4">
          <circle cx="-20" cy="-90" r="8" className="animate-float-slow" />
          <circle cx="-10" cy="-110" r="10" className="animate-float-slow" />
          <circle cx="0" cy="-130" r="12" className="animate-float-slow" />
        </g>
      </g>
      {/* Campfire */}
      <g transform="translate(720,710)">
        <circle cx="0" cy="0" r="60" fill="url(#fireGlow)" className="animate-flicker" />
        <polygon points="-10,0 0,-30 10,0" fill="#ff9f40" className="animate-flicker" />
        <polygon points="-6,0 0,-20 6,0" fill="#ffd27a" className="animate-flicker" />
        {/* logs */}
        <rect x="-25" y="20" width="50" height="8" fill="#5b3b27" transform="rotate(15)" />
        <rect x="-25" y="20" width="50" height="8" fill="#5b3b27" transform="rotate(-15)" />
      </g>
      {/* Trees */}
      <g fill="#0c3a2b">
        <polygon points="120,780 150,700 180,780" />
        <rect x="148" y="780" width="4" height="20" fill="#3a2a1e" />
        <polygon points="240,770 270,690 300,770" />
        <rect x="268" y="770" width="4" height="20" fill="#3a2a1e" />
        <polygon points="1320,760 1345,690 1370,760" />
        <rect x="1343" y="760" width="4" height="20" fill="#3a2a1e" />
      </g>
      {/* Stars / fireflies */}
      <g>
        <circle cx="200" cy="120" r="2" fill="#fff6d5" className="animate-twinkle" />
        <circle cx="420" cy="80" r="1.5" fill="#fff6d5" className="animate-twinkle" />
        <circle cx="860" cy="140" r="2" fill="#fff6d5" className="animate-twinkle" />
        <circle cx="1080" cy="60" r="1.5" fill="#fff6d5" className="animate-twinkle" />
      </g>
    </svg>
  );
}

function CharacterShowcase() {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  // Display 6 character avatars in a gentle marquee to add motion
  const ids = CHARACTERS.slice(0, 6).map((c) => c.id);
  return (
    <div className="mt-6 overflow-hidden">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {ids.concat(ids).map((id, i) => (
          // Use CSS mask to avoid broken image icons briefly flashing
          <img key={`${id}-${i}`} src={`${baseUrl}characters/${id}.svg`} alt="" className="h-12 w-12 object-contain opacity-80 [mask-image:linear-gradient(black,black)]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        ))}
      </div>
    </div>
  );
}
function Tile({ title, description, onClick, icon: Icon }: { title: string; description: string; onClick: () => void; icon: () => JSX.Element }) {
  return (
    <button onClick={onClick} className="group rounded-2xl border bg-white/85 backdrop-blur shadow hover:shadow-xl text-left p-5 h-36 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-lake-300/60 transition text-slate-800 relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-lake-200 opacity-0 group-hover:opacity-80 blur-2xl transition" />
      <div>
        <div className="flex items-center gap-2 text-lg font-semibold"><Icon /> {title}</div>
        <div className="text-sm opacity-80">{description}</div>
      </div>
      <div className="text-xs opacity-60">Open</div>
    </button>
  );
}

function TileLink({ title, description, to, icon: Icon }: { title: string; description: string; to: string; icon: () => JSX.Element }) {
  return (
    <Link to={to} className="group rounded-2xl border bg-white/85 backdrop-blur shadow hover:shadow-xl text-left p-5 h-36 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-lake-300/60 transition text-slate-800 relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-lake-200 opacity-0 group-hover:opacity-80 blur-2xl transition" />
      <div>
        <div className="flex items-center gap-2 text-lg font-semibold"><Icon /> {title}</div>
        <div className="text-sm opacity-80">{description}</div>
      </div>
      <div className="text-xs opacity-60">Open</div>
    </Link>
  );
}

function ActionBtn({ title, description, onClick, icon, badge }: { title: string; description: string; onClick: () => void; icon: React.ReactNode; badge?: string }) {
  return (
    <button onClick={onClick} className="group relative rounded-2xl border bg-white/85 backdrop-blur shadow hover:shadow-xl text-left px-4 py-3 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber-300/60 transition text-slate-800 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,200,100,.12),transparent_40%)]" />
      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 grid place-items-center shadow-inner flex-shrink-0">{icon}</div>
      <div className="flex items-center gap-2">
        <div className="font-semibold text-slate-900 whitespace-nowrap">{title}</div>
        {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">{badge}</span>}
      </div>
      <div className="text-xs opacity-70 pl-2 border-l border-amber-200/60 ml-2 whitespace-nowrap">{description}</div>
      <span className="absolute inset-0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </button>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function CogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/>
      <path d="M5 8a2 2 0 0 1-2-2V5h4"/>
      <path d="M19 8a2 2 0 0 0 2-2V5h-4"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  );
}


