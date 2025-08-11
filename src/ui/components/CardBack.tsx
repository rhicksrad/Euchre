type Props = {
  compact?: boolean;
};

export function CardBack({ compact = false }: Props) {
  const size = compact ? 'h-16 w-10' : 'h-24 w-16';
  return (
    <div
      aria-hidden
      className={`relative ${size} rounded-lg border-2 border-slate-700 shadow bg-slate-100 overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #0f172a 0, #0f172a 2px, transparent 2px, transparent 6px)',
        }}
      />
    </div>
  );
}


