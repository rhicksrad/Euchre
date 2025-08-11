const KEYS = ['euchre-v1', 'settings-v1', 'achievements-v1'];

export function clearAllSaves(): void {
  for (const k of KEYS) {
    try {
      localStorage.removeItem(k);
    } catch (err) {
      // ignore storage errors (privacy mode)
      console.warn('Failed to clear key', k, err);
    }
  }
}


