import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './shell/AppLayout';
import { StartScreen } from '../ui/screens/StartScreen';
import { CharacterSelect } from '../ui/screens/CharacterSelect';
import { NotFound } from '../ui/screens/NotFound';
import { GameView } from '../ui/screens/GameView';
import { About } from '../ui/screens/About';
import { Settings } from '../ui/screens/Settings';
import { Achievements } from '../ui/screens/Achievements';
import { Stats } from '../ui/screens/Stats';
import { Daily } from '../ui/screens/Daily';

const basename = (import.meta as any).env?.BASE_URL ? (import.meta as any).env.BASE_URL.replace(/\/$/, '') : '';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <StartScreen /> },
      { path: 'start/characters', element: <CharacterSelect /> },
      { path: 'game', element: <GameView /> },
      { path: 'about', element: <About /> },
      { path: 'settings', element: <Settings /> },
      { path: 'achievements', element: <Achievements /> },
      { path: 'stats', element: <Stats /> },
      { path: 'daily', element: <Daily /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename });


