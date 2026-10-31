import { formatCoef } from '../lib/math';

interface SliderRowProps {
  coef: 'k' | 'b';
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const COLORS: Record<'k' | 'b', { bg: string; color: string }> = {
  k: { bg: 'var(--color-k)', color: '#fff' },
  b: { bg: 'var(--color-b)', color: 'var(--ink)' },
};

export function SliderRow({ coef, value, min, max, step, onChange }: SliderRowProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const { bg, color } = COLORS[coef];

  return (
    <div
      className="glass"
      style={{
        borderRadius: 24,
        height: 56,
        boxSizing: 'border-box',
        padding: '0 18px 0 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <label
        htmlFor={`slider-${coef}`}
        style={{
          flex: 'none',
          width: 36,
          height: 36,
          borderRadius: 12,
          background: bg,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Unbounded','Manrope',sans-serif",
          fontWeight: 600,
          fontSize: 19,
        }}
      >
        {coef}
      </label>
      <input
        id={`slider-${coef}`}
        className="dz"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--c' as string]: bg, ['--p' as string]: `${percent}%`, flex: 1, minWidth: 0 }}
        aria-label={`Коэффициент ${coef}`}
      />
      <div
        style={{
          flex: 'none',
          minWidth: 40,
          textAlign: 'right',
          fontFamily: "'Unbounded','Manrope',sans-serif",
          fontWeight: 600,
          fontSize: 19,
          color: 'var(--ink)',
        }}
      >
        {formatCoef(value)}
      </div>
    </div>
  );
}
