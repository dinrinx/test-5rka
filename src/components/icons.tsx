export function ArrowRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M9 5.5l6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RulesIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <rect x={1} y={1} width={6} height={6} rx={1.6} fill="#0B2A5B" />
      <rect x={9} y={1} width={6} height={6} rx={1.6} fill="#0B2A5B" />
      <rect x={1.8} y={9.8} width={5.4} height={5.4} rx={1.4} fill="none" stroke="#0B2A5B" strokeWidth={1.6} />
      <rect x={9.8} y={9.8} width={5.4} height={5.4} rx={1.4} fill="none" stroke="#0B2A5B" strokeWidth={1.6} />
    </svg>
  );
}
