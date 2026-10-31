import { MascotGlyph } from './MascotGlyph';
import type { MascotState } from '../types';

export function Mascot({ state, size = 44 }: { state: MascotState; size?: number }) {
  return (
    <svg viewBox="0 0 100 104" width={size} height={size * 1.04} aria-hidden="true" style={{ flex: 'none', display: 'block' }}>
      <MascotGlyph state={state} />
    </svg>
  );
}
