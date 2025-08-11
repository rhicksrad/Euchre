// Adirondack-themed SVG icons for UI
// All icons are 18x18, currentColor stroke

export function MountainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 20l6.5-10 3 5 2-3L21 20H3z" />
      <path d="M9.5 10l1.5-2 1 1.5" />
    </svg>
  );
}

export function PineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2l-3 4h6l-3-4z" />
      <path d="M7 9h10l-5-7-5 7z" />
      <path d="M6 12h12l-6-8-6 8z" />
      <path d="M12 12v8" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function CanoeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 15s3 3 10 3 10-3 10-3" />
      <path d="M12 6l3 6H9l3-6z" />
    </svg>
  );
}

export function FishingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 3v10a4 4 0 1 0 8 0V6" />
      <path d="M12 6c2 0 3-2 5-2" />
      <circle cx="16" cy="4" r="0.5" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15l6-3-3 6-3-3z" />
    </svg>
  );
}

export function CampfireIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 14c2 0 3-2.5 1.8-4.2C12.7 8 12 6 12 5c0 2-3 3.5-3 6 0 1.7 1.3 3 3 3z" />
      <path d="M6 20l12-4" />
      <path d="M6 16l12 4" />
    </svg>
  );
}

export function TrophyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M5 8a2 2 0 0 1-2-2V5h4" />
      <path d="M19 8a2 2 0 0 0 2-2V5h-4" />
    </svg>
  );
}


