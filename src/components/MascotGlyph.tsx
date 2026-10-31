import { useId } from 'react';
import type { MascotState } from '../types';

/**
 * Содержимое маскота (глянцевый мячик) как <g>, без обёртки <svg> —
 * чтобы можно было встраивать его и в отдельный <Mascot>, и прямо внутрь GraphSVG.
 * Исходный viewBox 0 0 100 104.
 */
export function MascotGlyph({ state }: { state: MascotState }) {
  const gradId = `mascot-grad-${useId()}`;

  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx=".34" cy=".28" r=".85">
          <stop offset="0" stopColor="#F8FF92" />
          <stop offset=".5" stopColor="#D6EC30" />
          <stop offset="1" stopColor="#8FA614" />
        </radialGradient>
      </defs>
      <ellipse cx={50} cy={99} rx={30} ry={4} fill="#0B2A5B" opacity={0.16} />
      <circle cx={50} cy={50} r={48} fill={`url(#${gradId})`} />
      <path d="M10 26 C32 42 32 58 10 74" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" opacity={0.92} />
      <path d="M90 26 C68 42 68 58 90 74" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" opacity={0.92} />
      <ellipse cx={34} cy={22} rx={17} ry={9} fill="#fff" opacity={0.5} transform="rotate(-28 34 22)" />

      {state === 'idle' && (
        <>
          <ellipse cx={38} cy={47} rx={4.6} ry={6} fill="#0B2A5B" />
          <ellipse cx={62} cy={47} rx={4.6} ry={6} fill="#0B2A5B" />
          <circle cx={39.6} cy={44.5} r={1.7} fill="#fff" />
          <circle cx={63.6} cy={44.5} r={1.7} fill="#fff" />
          <path d="M41 62 Q50 70 59 62" fill="none" stroke="#0B2A5B" strokeWidth={3.4} strokeLinecap="round" />
        </>
      )}

      {state === 'happy' && (
        <>
          <path d="M30 50 Q36 41 42 50" fill="none" stroke="#0B2A5B" strokeWidth={3.8} strokeLinecap="round" />
          <path d="M58 50 Q64 41 70 50" fill="none" stroke="#0B2A5B" strokeWidth={3.8} strokeLinecap="round" />
          <path d="M35 58 Q50 82 65 58 Z" fill="#0B2A5B" />
          <path d="M43 71 Q50 64 57 71 Q50 77 43 71Z" fill="#FF8795" />
          <ellipse cx={27} cy={60} rx={6} ry={4} fill="#FF9FB0" opacity={0.75} />
          <ellipse cx={73} cy={60} rx={6} ry={4} fill="#FF9FB0" opacity={0.75} />
        </>
      )}

      {state === 'sad' && (
        <>
          <ellipse cx={38} cy={50} rx={4.6} ry={6} fill="#0B2A5B" />
          <ellipse cx={62} cy={50} rx={4.6} ry={6} fill="#0B2A5B" />
          <circle cx={39.6} cy={47.5} r={1.7} fill="#fff" />
          <circle cx={63.6} cy={47.5} r={1.7} fill="#fff" />
          <path d="M30 38 L44 43 M70 38 L56 43" stroke="#0B2A5B" strokeWidth={3.2} strokeLinecap="round" />
          <path d="M40 71 Q50 61 60 71" fill="none" stroke="#0B2A5B" strokeWidth={3.4} strokeLinecap="round" />
          <path d="M68 56 Q73 64 68 68 Q63 64 68 56Z" fill="#8FC4FF" stroke="#0B2A5B" strokeWidth={1.2} />
        </>
      )}
    </g>
  );
}
