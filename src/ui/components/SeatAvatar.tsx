import { useEffect, useState } from 'react';
import type { CharacterId } from '../../game/characters';
import { CharacterAvatar } from '../assets/characters';

export function SeatAvatar({ id }: { id: CharacterId | null }) {
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  if (!id) return <DefaultAvatar label="NPC" />;

  useEffect(() => {
    let cancelled = false;
    const baseUrl = (import.meta as any).env?.BASE_URL || '/';
    const src = `${baseUrl}characters/${id}.svg`;
    fetch(src, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const txt = await r.text();
        if (cancelled) return;
        setMarkup(sanitizeSvg(txt));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (failed) return <div className="h-12 w-12" aria-label={`Avatar ${id}`}>{CharacterAvatar[id]}</div>;
  if (markup) {
    return (
      <div
        className="h-12 w-12"
        role="img"
        aria-label={`Avatar ${id}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
  return <div className="h-12 w-12 rounded-full border border-emerald-900/30 bg-emerald-50/40" aria-label={`Avatar ${id}`} />;
}

function DefaultAvatar({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 128 128" className="h-12 w-12" role="img" aria-label={`Avatar ${label}`}>
      <circle cx="64" cy="64" r="62" fill="#e5dccd" stroke="#1f4d2e" strokeWidth="4" />
      <text x="64" y="70" textAnchor="middle" fontSize="12" fill="#1f4d2e">{label}</text>
    </svg>
  );
}

function sanitizeSvg(svg: string): string {
  // Remove scripts and on* attributes for safety
  return svg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on[a-z]+="[^"]*"/gi, '')
    .replace(/on[a-z]+='[^']*'/gi, '');
}


