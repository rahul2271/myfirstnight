export function Stars({ value, size = 13, className = '' }: { value: number; size?: number; className?: string }) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  return (
    <span className={`relative inline-block leading-none whitespace-nowrap ${className}`} style={{ fontSize: size }} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="text-mfn-midnight/15 tracking-[0.12em]">★★★★★</span>
      <span className="absolute left-0 top-0 overflow-hidden text-mfn-gold tracking-[0.12em]" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}
