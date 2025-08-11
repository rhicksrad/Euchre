class GameAudio {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private volume = 0.5;
  private bgGainNode: GainNode | null = null;
  private bgStopper: (() => void) | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      // @ts-expect-error - webkitAudioContext exists on some browsers
      const AC: typeof AudioContext | undefined = window.AudioContext || window.webkitAudioContext;
      if (!AC) { this.ctx = null; this.initialized = false; return; }
      this.ctx = new AC();
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.initialized = true;
    } catch {
      this.ctx = null;
      this.initialized = false;
    }
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.bgGainNode) {
      // Keep background level gentle relative to global volume
      this.bgGainNode.gain.value = this.volume * 0.2;
    }
  }

  async play(kind: 'deal' | 'trick' | 'hand' | 'bg' | 'bg_alt'): Promise<void> {
    if (!this.ctx) return;
    const ctx = this.ctx;
    try {
      if (kind === 'bg' || kind === 'bg_alt') {
        this.stopBg();
        // Try user-provided tracks from public/ first; fall back to WebAudio ambience if missing
        const candidates = this.buildBgmCandidates(kind);
        const audioBuf = await this.tryLoadFirstAvailable(candidates);
        if (audioBuf) {
          const src = ctx.createBufferSource();
          const gain = ctx.createGain();
          src.buffer = audioBuf;
          src.loop = true;
          gain.gain.value = this.volume * 0.2;
          src.connect(gain).connect(ctx.destination);
          src.start();
          this.bgGainNode = gain;
          this.bgStopper = () => {
            try { src.stop(); } catch {}
            try { src.disconnect(); } catch {}
            try { gain.disconnect(); } catch {}
            this.bgGainNode = null;
          };
          return;
        }
        // Fall back to a generated ambient pad
        this.playAmbientFallback(kind === 'bg' ? 'Amin' : 'Cmaj');
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.value = kind === 'hand' ? 440 : kind === 'trick' ? 660 : 320;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(this.volume, now + 0.01);
      const dur = kind === 'hand' ? 0.25 : 0.12;
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // ignore
    }
  }

  stopBg(): void {
    if (this.bgStopper) {
      this.bgStopper();
      this.bgStopper = null;
    }
  }

  private playAmbientFallback(mode: 'Amin' | 'Cmaj'): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.stopBg();
    const master = ctx.createGain();
    master.gain.value = this.volume * 0.12;
    master.connect(ctx.destination);

    const freqs = mode === 'Amin' ? [220, 261.63, 329.63] : [261.63, 329.63, 392.0];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    for (const f of freqs) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.4; // mixed under master
      o.connect(g).connect(master);
      o.start();
      oscs.push(o);
      gains.push(g);
    }

    // Gentle filter movement using periodic detune sweeps
    let alive = true;
    const sweep = () => {
      if (!alive) return;
      const now = ctx.currentTime;
      oscs.forEach((o, i) => {
        const amount = (i + 1) * 8;
        o.detune.cancelScheduledValues(now);
        o.detune.setValueAtTime(-amount, now);
        o.detune.linearRampToValueAtTime(amount, now + 6 + i * 0.5);
        o.detune.linearRampToValueAtTime(-amount, now + 12 + i * 0.5);
      });
      // schedule next sweep
      setTimeout(sweep, 6000);
    };
    sweep();

    this.bgGainNode = master;
    this.bgStopper = () => {
      alive = false;
      oscs.forEach((o) => { try { o.stop(); } catch {} try { o.disconnect(); } catch {} });
      gains.forEach((g) => { try { g.disconnect(); } catch {} });
      try { master.disconnect(); } catch {}
      this.bgGainNode = null;
    };
  }

  private buildBgmCandidates(kind: 'bg' | 'bg_alt'): string[] {
    // Allow various common file names and folders under public/
    const bases = kind === 'bg' ? ['bgm1', 'bgm', 'ambient', 'music', 'track1'] : ['bgm2', 'bgm_alt', 'ambient2', 'music2', 'track2'];
    const exts = ['mp3', 'ogg', 'wav'];
    const folders = ['', '/audio', '/music', '/sounds'];
    const paths: string[] = [];
    for (const folder of folders) {
      for (const base of bases) {
        for (const ext of exts) {
          paths.push(`${folder}/${base}.${ext}`.replace('//', '/'));
        }
      }
    }
    return paths;
  }

  private async tryLoadFirstAvailable(paths: string[]): Promise<AudioBuffer | null> {
    const ctx = this.ctx;
    if (!ctx) return null;
    const baseUrl: string = (import.meta as any).env?.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    for (const p of paths) {
      try {
        const normalized = p.startsWith('/') ? p.slice(1) : p;
        const url = `${normalizedBase}${normalized}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const buf = await res.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(buf);
        return audioBuf;
      } catch {
        // continue to next
      }
    }
    return null;
  }
}

export const audio = new GameAudio();


