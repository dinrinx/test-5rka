function Star({ filled, size = 44 }: { filled: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ flex: 'none' }}>
      <path
        d="M12 2.6l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.6 5.9 21.1l1.3-6.8-5-4.7 6.8-.8z"
        fill={filled ? '#DDF55A' : 'rgba(11,42,91,.12)'}
        stroke="#0B2A5B"
        strokeOpacity={filled ? 1 : 0.35}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarsRow({ count, size }: { count: number; size?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      {[1, 2, 3].map((i) => (
        <Star key={i} filled={i <= count} size={size} />
      ))}
    </div>
  );
}
