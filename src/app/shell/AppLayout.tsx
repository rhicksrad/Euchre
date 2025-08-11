import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MountainIcon, PineIcon, CanoeIcon, CompassIcon } from '../../ui/assets/lodgeIcons';
import { SettingsEffect } from '../providers/SettingsEffect';
import { RehydrateEffect } from '../providers/RehydrateEffect';
import { AudioEffect } from '../providers/AudioEffect';
import { CaptionBar } from '../../ui/components/CaptionBar';
import { HowToOverlay } from '../../ui/components/HowToOverlay';
import { TutorialOverlay } from '../../ui/components/TutorialOverlay';
import { useEffect } from 'react';
import { events } from '../../services/events';
import { useStats } from '../../state/stats';
import { useDailyStore } from '../../state/dailyStore';
import { useGameStore } from '../../state/store';

export function AppLayout() {
  const location = useLocation();
  const isStart = location.pathname === '/';
  const isGame = location.pathname.startsWith('/game');
  const navigate = useNavigate();
  const updateHand = useStats((s) => s.updateOnHandEnd);
  const updateGame = useStats((s) => s.updateOnGameEnd);
  const daily = useDailyStore();
  useEffect(() => {
    const off1 = events.on('handEnd', (p) => { updateHand(p); daily.trackHandEnd({ makersTeam: p.makersTeam, defendersWonTricks: p.defendersWonTricks }); });
    const off2 = events.on('gameEnd', (p) => { updateGame(p); daily.trackGameEnd({ winnerTeam: p.winnerTeam }); });
    return () => { off1(); off2(); };
  }, [updateHand, updateGame, daily]);
  return (
    <div className="min-h-screen bg-lodge-canvas text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-ui">
      {!isStart && (
      <header className="border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/30 backdrop-blur sticky top-0 z-10">
        <div className={`mx-auto max-w-6xl px-4 py-3 flex items-center ${isGame ? 'justify-center' : 'justify-between'}`}>
          {!isGame && (
          <div className="text-lg font-semibold tracking-wide flex items-center gap-2 text-slate-900 dark:text-white">
            <MountainIcon />
            Euchre in the Adirondacks
          </div>
          )}
          <nav className={`flex gap-2 text-sm items-center ${isGame ? 'justify-center' : ''}`}>
            {isGame ? (
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => navigate('/')}
                >Back</button>
                <button
                  className="rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    const { resetAll, startNewHand, seatCharacters } = useGameStore.getState();
                    const seats = { ...seatCharacters } as any;
                    resetAll();
                    useGameStore.getState().setSeatCharacters(seats);
                    startNewHand();
                  }}
                >New Game</button>
              </div>
            ) : (
              <>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/"
            >Start</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/start/characters"
            >Characters</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/game"
            >Game</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/achievements"
            >Achievements</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/stats"
            >Stats</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/daily"
            >Daily</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/settings"
            >Settings</NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  isActive ? 'bg-lake-200 text-lake-900 dark:bg-lake-300/30 dark:text-lake-200 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-90'
                }`
              }
              to="/about"
            >About</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <SettingsEffect />
        <RehydrateEffect />
        <AudioEffect />
        <Outlet />
        <CaptionBar />
        <HowToOverlay />
        <TutorialOverlay />
      </main>
    </div>
  );
}


