export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,.7)', flex: 'none' }}
    >
      <div style={{ width: `${percent}%`, height: '100%', borderRadius: 3, background: 'var(--ink)', transition: 'width .3s ease' }} />
    </div>
  );
}
