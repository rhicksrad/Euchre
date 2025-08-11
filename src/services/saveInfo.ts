export function getSavedGamePhase(): string | null {
  try {
    const raw = localStorage.getItem('euchre-v1');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const phase = parsed?.state?.phase;
    return typeof phase === 'string' ? phase : null;
  } catch {
    return null;
  }
}


