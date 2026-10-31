import type { ReactNode } from 'react';
import { Mascot } from './Mascot';
import type { MascotState } from '../types';

interface SpeechBubbleProps {
  mascotState: MascotState;
  children: ReactNode;
  action?: ReactNode;
}

export function SpeechBubble({ mascotState, children, action }: SpeechBubbleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 'none', boxSizing: 'border-box' }}>
      <Mascot state={mascotState} />
      <div
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          background: 'rgba(255,255,255,.86)',
          border: '1px solid #fff',
          borderRadius: 22,
          boxShadow: '0 14px 30px rgba(14,60,140,.2)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxSizing: 'border-box',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -7,
            top: 26,
            width: 16,
            height: 16,
            transform: 'rotate(45deg)',
            background: 'rgba(255,255,255,.86)',
            borderLeft: '1px solid #fff',
            borderBottom: '1px solid #fff',
            borderRadius: '0 0 0 4px',
          }}
        />
        <div style={{ font: "600 14px/1.35 'Manrope',sans-serif", color: 'var(--ink)' }}>{children}</div>
        {action && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{action}</div>}
      </div>
    </div>
  );
}
