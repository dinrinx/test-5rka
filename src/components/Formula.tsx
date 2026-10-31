import { formatCoef } from '../lib/math';

interface FormulaProps {
  k: number;
  b: number;
  activeK: boolean;
  activeB: boolean;
  size?: 'md' | 'lg';
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ flex: 'none' }}>
      <rect x={5} y={10.5} width={14} height={10} rx={3} fill="currentColor" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

function Tile({
  value,
  bg,
  color,
  locked,
}: {
  value: number;
  bg: string;
  color: string;
  locked: boolean;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: locked ? 'rgba(11,42,91,.16)' : bg,
        color: locked ? 'rgba(11,42,91,.55)' : color,
        borderRadius: '.34em',
        padding: '.02em .24em .06em',
        lineHeight: 1.1,
      }}
    >
      {locked && <LockIcon />}
      {formatCoef(value)}
    </span>
  );
}

export function Formula({ k, b, activeK, activeB, size = 'lg' }: FormulaProps) {
  const fontSize = size === 'lg' ? 28 : 22;
  return (
    <div
      role="img"
      aria-label={`y = ${formatCoef(k)}x + ${formatCoef(b)}`}
      style={{
        fontFamily: "'Unbounded','Manrope',sans-serif",
        fontWeight: 600,
        fontSize,
        lineHeight: 1.15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        color: 'var(--ink)',
        whiteSpace: 'nowrap',
      }}
    >
      <span>y</span>
      <span>=</span>
      <Tile value={k} bg="var(--color-k)" color="#fff" locked={!activeK} />
      <span>x</span>
      <span>+</span>
      <Tile value={b} bg="var(--color-b)" color="var(--ink)" locked={!activeB} />
    </div>
  );
}
