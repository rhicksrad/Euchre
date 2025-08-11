import { ReactNode } from 'react';
import { useSettings } from '../../state/settings';

type TableProps = {
  top: ReactNode;
  left: ReactNode;
  right: ReactNode;
  bottom: ReactNode;
  felt: ReactNode;
  leftBottom?: ReactNode;
  rightBottom?: ReactNode;
};

export function Table({ top, left, right, bottom, felt, leftBottom, rightBottom }: TableProps) {
  const theme = useSettings((s) => s.tableTheme);
  return (
    <div className="grid grid-cols-[260px_minmax(640px,1fr)_260px] grid-rows-[160px_minmax(300px,1fr)_200px] gap-4 will-change-transform">
      {/* Top seat centered above felt */}
      <div className="col-start-2 row-start-1">{top}</div>
      {/* Left seat */}
      <div className="col-start-1 row-start-2">{left}</div>
      {/* Felt */}
      <div className={`table-felt col-start-2 row-start-2 rounded-lg text-white p-4 min-h-[150px] shadow-inner ${themeClass(theme)}`} aria-label="Felt play area">
        {felt}
      </div>
      {/* Right seat (east) */}
      <div className="col-start-3 row-start-2">{right}</div>
      {/* Player seat below felt */}
      <div className="col-start-2 row-start-3">{bottom}</div>
      {/* Below west: score */}
      <div className="col-start-1 row-start-3">{leftBottom}</div>
      {/* Below east: log */}
      <div className="col-start-3 row-start-3">{rightBottom}</div>
    </div>
  );
}

function themeClass(theme: 'lakeside' | 'lodge' | 'campfire' | 'winter'): string {
  switch (theme) {
    case 'lakeside':
      return 'bg-lodge-felt/90 theme-lakeside ring-2 ring-lake-300/60';
    case 'campfire':
      return 'bg-lodge-felt/90 theme-campfire ring-2 ring-amber-400/60';
    case 'winter':
      return 'bg-lodge-felt/90 theme-winter ring-2 ring-sky-300/60';
    default:
      return 'bg-lodge-felt/90 theme-lodge ring-2 ring-emerald-700/40';
  }
}


