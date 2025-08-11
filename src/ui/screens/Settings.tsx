import { useAppStore } from '../../app/providers/state';
import { useSettings } from '../../state/settings';
import { useTutorial } from '../../state/tutorial';

export function Settings() {
  const difficulty = useAppStore((s) => s.difficulty);
  const setDifficulty = useAppStore((s) => s.setDifficulty);
  const s = useSettings();
  const tutorial = useTutorial();
  return (
    <section className="mx-auto max-w-6xl grid gap-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-700 text-sm mt-1">Tune visuals, audio, and gameplay to your preference.</p>
      </div>

      {/* Gameplay */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm text-slate-800 grid gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Gameplay</div>
          <p className="text-xs text-slate-600">Choose AI difficulty.</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="AI Difficulty">
          {(['Casual', 'Standard', 'Shark'] as const).map((d) => (
            <button
              key={d}
              className={`rounded-lg border px-3 py-1 ${difficulty === d ? 'bg-lodge-pine text-white' : 'bg-white'}`}
              onClick={() => setDifficulty(d)}
              aria-pressed={difficulty === d}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Theme */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Table</div>
          <p className="text-xs text-slate-600">Pick a table ambiance and preview it.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_280px] md:items-start">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-800">Table theme</label>
            <select value={s.tableTheme} onChange={(e) => s.setTableTheme(e.target.value as any)} className="rounded-md border-2 border-emerald-700/40 text-slate-900 px-2 py-1 text-sm bg-white w-52 shadow-sm focus:outline-none focus:ring-2 focus:ring-lake-300/60">
              <option value="lodge">Lodge (default)</option>
              <option value="lakeside">Lakeside</option>
              <option value="campfire">Campfire</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div className={`rounded-lg h-28 shadow-inner border ${previewThemeClass(s.tableTheme)} `} aria-label="Table preview" />
        </div>
      </div>

      {/* Accessibility */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Accessibility</div>
          <p className="text-xs text-slate-600">Visual comfort and motion preferences.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-800">Color-blind mode</label>
            <select
              value={s.colorBlind}
              onChange={(e) => useSettings.getState().setColorBlind(e.target.value as 'none' | 'deuteranopia' | 'protanopia')}
              className="rounded-md border-2 border-emerald-700/40 text-slate-900 px-2 py-1 text-sm bg-white w-52 focus:outline-none focus:ring-2 focus:ring-lake-300/60"
            >
              <option value="none">None</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="protanopia">Protanopia</option>
            </select>
          </div>
          <Toggle id="hc" label="High contrast" checked={s.highContrast} onChange={(v) => s.setHighContrast(v)} />
          <Toggle id="rm" label="Reduced motion" checked={s.reducedMotion} onChange={(v) => s.setReducedMotion(v)} />
          <div className="grid gap-1 col-span-full">
            <label className="text-sm text-slate-800">Text scale ({s.textScale.toFixed(2)}x)</label>
            <input type="range" min={0.9} max={1.4} step={0.05} value={s.textScale} onChange={(e) => s.setTextScale(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Audio */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Audio</div>
          <p className="text-xs text-slate-600">Sound cues and ambience.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle id="snd" label="Enable sound" checked={s.soundEnabled} onChange={(v) => s.setSoundEnabled(v)} />
          <div className="grid gap-1">
            <label className="text-sm text-slate-800">Background music</label>
            <div className="flex gap-2">
              <button
                className={`rounded-md border px-3 py-1 text-sm ${s.bgm === 'bg' ? 'bg-lodge-pine text-white border-lodge-pine' : 'bg-white text-slate-800 border-slate-300 hover:bg-black/5'}`}
                aria-pressed={s.bgm === 'bg'}
                onClick={() => s.setBgm('bg')}
              >
                Track 1
              </button>
              <button
                className={`rounded-md border px-3 py-1 text-sm ${s.bgm === 'bg_alt' ? 'bg-lodge-pine text-white border-lodge-pine' : 'bg-white text-slate-800 border-slate-300 hover:bg-black/5'}`}
                aria-pressed={s.bgm === 'bg_alt'}
                onClick={() => s.setBgm('bg_alt')}
              >
                Track 2
              </button>
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-slate-800">Sound volume ({Math.round(s.volume * 100)}%)</label>
            <input type="range" min={0} max={1} step={0.05} value={s.volume} onChange={(e) => s.setVolume(Number(e.target.value))} />
          </div>
          <Toggle id="cap" label="Captions for sound cues" checked={s.captions} onChange={(v) => s.setCaptions(v)} />
          <div className="grid gap-1">
            <label className="text-sm text-slate-800">Caption duration ({Math.round(s.captionDurationMs/100)/10}s)</label>
            <input type="range" min={1000} max={6000} step={250} value={s.captionDurationMs} onChange={(e) => s.setCaptionDurationMs(Number(e.target.value))} />
          </div>
          <Toggle id="amb" label="Enable ambience (background pad)" checked={s.ambienceEnabled} onChange={(v) => s.setAmbienceEnabled(v)} />
        </div>
      </div>

      {/* Interface */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm grid gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Interface</div>
          <p className="text-xs text-slate-600">Labels and tutorial guidance.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle id="labels" label="Show seat labels" checked={s.showSeatLabels} onChange={(v) => s.setShowSeatLabels(v)} />
          <Toggle id="tut" label="Enable tutorial" checked={tutorial.enabled} onChange={(v) => tutorial.setEnabled(v)} />
        </div>
      </div>
    </section>
  );
}

function Toggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-white/70 px-3 py-2">
      <label htmlFor={id} className="text-sm text-slate-800 select-none cursor-pointer">{label}</label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${checked ? 'bg-lodge-pine' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function previewThemeClass(theme: 'lakeside' | 'lodge' | 'campfire' | 'winter'): string {
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


