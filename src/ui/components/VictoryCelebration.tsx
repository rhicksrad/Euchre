import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MountainIcon, PineIcon, TrophyIcon } from '../assets/lodgeIcons';

type Props = {
  winnerTeam: 'NS' | 'EW';
  score: { NS: number; EW: number };
  onNewGame: () => void;
};

// Confetti particle component
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const duration = 3 + Math.random() * 2; // 3-5 seconds
  const size = 8 + Math.random() * 8; // 8-16px
  const rotation = Math.random() * 360;
  
  return (
    <div
      className="absolute animate-confetti-fall pointer-events-none"
      style={{
        left: `${x}%`,
        top: '-20px',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div
        className="animate-confetti-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    </div>
  );
}

export function VictoryCelebration({ winnerTeam, score, onNewGame }: Props) {
  const nav = useNavigate();
  const [confetti, setConfetti] = useState<Array<{ id: number; delay: number; x: number }>>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  
  useEffect(() => {
    // Generate confetti particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        delay: Math.random() * 2, // Stagger over 2 seconds
        x: Math.random() * 100, // Spread across width
      });
    }
    setConfetti(particles);
    
    // Show fireworks after a delay
    setTimeout(() => setShowFireworks(true), 500);
    
    // Auto-advance after 10 seconds if user doesn't click
    const autoCloseTimer = setTimeout(() => onNewGame(), 10000);
    
    return () => clearTimeout(autoCloseTimer);
  }, [onNewGame]);
  
  const winnerLabel = winnerTeam === 'NS' ? 'North/South' : 'East/West';
  const margin = Math.abs(score.NS - score.EW);
  
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onNewGame} />
      
      {/* Confetti layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((p) => (
          <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
        ))}
      </div>
      
      {/* Fireworks effect */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-firework">
            <div className="w-32 h-32 rounded-full bg-gradient-radial from-yellow-300 via-orange-400 to-transparent opacity-0 animate-firework-burst" />
          </div>
          <div className="absolute top-1/3 right-1/3 animate-firework" style={{ animationDelay: '0.3s' }}>
            <div className="w-40 h-40 rounded-full bg-gradient-radial from-blue-300 via-purple-400 to-transparent opacity-0 animate-firework-burst" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-firework" style={{ animationDelay: '0.6s' }}>
            <div className="w-36 h-36 rounded-full bg-gradient-radial from-green-300 via-emerald-400 to-transparent opacity-0 animate-firework-burst" />
          </div>
        </div>
      )}
      
      {/* Victory message */}
      <div className="relative z-10 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center animate-victory-bounce">
        <div className="flex justify-center mb-4">
          <TrophyIcon className="w-20 h-20 text-yellow-500 animate-trophy-shine" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Victory!</h1>
        <p className="text-xl text-slate-700 mb-4">
          Team {winnerLabel} wins!
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-lodge-canvas/20 rounded-lg">
          <div className={`p-3 rounded ${winnerTeam === 'NS' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'}`}>
            <div className="font-semibold text-slate-900">North/South</div>
            <div className="text-2xl font-bold">{score.NS}</div>
          </div>
          <div className={`p-3 rounded ${winnerTeam === 'EW' ? 'bg-green-100 ring-2 ring-green-500' : 'bg-gray-100'}`}>
            <div className="font-semibold text-slate-900">East/West</div>
            <div className="text-2xl font-bold">{score.EW}</div>
          </div>
        </div>
        
        {margin >= 6 && (
          <div className="mb-4 p-3 bg-yellow-100 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <MountainIcon className="w-5 h-5" />
              <span className="font-semibold">Mount Marcy Achievement!</span>
              <MountainIcon className="w-5 h-5" />
            </div>
            <div className="text-sm text-yellow-700 mt-1">Won by {margin} points!</div>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onNewGame}
            className="px-6 py-3 bg-lodge-pine text-white rounded-lg font-semibold hover:bg-lodge-pine/90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            New Game
          </button>
          <button
            onClick={() => nav('/stats')}
            className="px-6 py-3 bg-white text-slate-800 border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            View Stats
          </button>
        </div>
        
        <div className="mt-6 flex justify-center gap-2 text-lodge-pine">
          <PineIcon className="w-6 h-6 animate-pulse" />
          <PineIcon className="w-8 h-8" />
          <PineIcon className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
