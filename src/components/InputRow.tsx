interface InputRowProps {
  coef: 'k' | 'b';
  raw: string;
  valid: boolean;
  onChange: (raw: string) => void;
  onStep: (direction: 1 | -1) => void;
}

const COLORS: Record<'k' | 'b', { bg: string; color: string }> = {
  k: { bg: 'var(--color-k)', color: '#fff' },
  b: { bg: 'var(--color-b)', color: 'var(--ink)' },
};

function StepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label === '+' ? 'Увеличить' : 'Уменьшить'}
      style={{
        flex: 'none',
        width: 36,
        height: 36,
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,.85)',
        background: 'rgba(255,255,255,0.7)',
        color: 'var(--ink)',
        fontFamily: "'Unbounded','Manrope',sans-serif",
        fontWeight: 600,
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 14px rgba(14,60,140,.16)',
      }}
    >
      {label}
    </button>
  );
}

export function InputRow({ coef, raw, valid, onChange, onStep }: InputRowProps) {
  const { bg, color } = COLORS[coef];

  return (
    <div
      className="glass"
      style={{
        borderRadius: 24,
        height: 56,
        boxSizing: 'border-box',
        padding: '0 10px 0 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
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
      </div>
      <StepButton label="−" onClick={() => onStep(-1)} />
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        aria-label={`Коэффициент ${coef}`}
        aria-invalid={raw !== '' && !valid}
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: raw !== '' && !valid ? 'rgba(255,99,99,.12)' : 'transparent',
          borderRadius: 10,
          textAlign: 'center',
          fontFamily: "'Unbounded','Manrope',sans-serif",
          fontWeight: 600,
          fontSize: 19,
          color: 'var(--ink)',
          height: 36,
        }}
      />
      <StepButton label="+" onClick={() => onStep(1)} />
    </div>
  );
}
