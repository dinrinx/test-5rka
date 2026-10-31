import { CELL, GRID_MAX, GRID_MIN, INNER, PAD, SVG_SIZE, clipLineToGrid, toX, toY } from '../lib/graph';

interface TargetPoint {
  x: number;
  y: number;
  hit: boolean;
}

interface GraphSVGProps {
  k: number;
  b: number;
  points: TargetPoint[];
  ghost?: { k: number; b: number } | null;
  ariaLabel?: string;
}

const TICKS = Array.from({ length: GRID_MAX - GRID_MIN + 1 }, (_, i) => GRID_MIN + i);

export function GraphSVG({ k, b, points, ghost, ariaLabel }: GraphSVGProps) {
  const segment = clipLineToGrid(k, b);
  const ghostSegment = ghost ? clipLineToGrid(ghost.k, ghost.b) : null;

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={ariaLabel ?? 'График, сетка от −5 до 5'}
      style={{ display: 'block', touchAction: 'none' }}
    >
      {TICKS.map((t) => (
        <line
          key={`v${t}`}
          x1={toX(t)}
          y1={PAD}
          x2={toX(t)}
          y2={SVG_SIZE - PAD}
          stroke="#0B2A5B"
          strokeOpacity={t === 0 ? undefined : 0.14}
          strokeWidth={t === 0 ? 1.8 : 1}
        />
      ))}
      {TICKS.map((t) => (
        <line
          key={`h${t}`}
          x1={PAD}
          y1={toY(t)}
          x2={SVG_SIZE - PAD}
          y2={toY(t)}
          stroke="#0B2A5B"
          strokeOpacity={t === 0 ? undefined : 0.14}
          strokeWidth={t === 0 ? 1.8 : 1}
        />
      ))}
      <rect x={PAD} y={PAD} width={INNER} height={INNER} fill="none" stroke="#0B2A5B" strokeOpacity={0.4} strokeWidth={1.4} />

      {TICKS.filter((t) => t !== 0).map((t) => (
        <text
          key={`tx${t}`}
          x={toX(t)}
          y={SVG_SIZE - PAD + 13}
          fontSize={9}
          fontWeight={700}
          fill="#0B2A5B"
          fillOpacity={0.45}
          textAnchor="middle"
          fontFamily="Manrope, sans-serif"
        >
          {t}
        </text>
      ))}
      {TICKS.filter((t) => t !== 0).map((t) => (
        <text
          key={`ty${t}`}
          x={PAD - 6}
          y={toY(t) + 3}
          fontSize={9}
          fontWeight={700}
          fill="#0B2A5B"
          fillOpacity={0.45}
          textAnchor="end"
          fontFamily="Manrope, sans-serif"
        >
          {t}
        </text>
      ))}
      <text x={SVG_SIZE - PAD + 10} y={toY(0) + 3} fontSize={12} fontWeight={800} fill="#0B2A5B" fillOpacity={0.55} fontFamily="Manrope, sans-serif">
        x
      </text>
      <text x={toX(0) - 3} y={PAD - 8} fontSize={12} fontWeight={800} fill="#0B2A5B" fillOpacity={0.55} textAnchor="middle" fontFamily="Manrope, sans-serif">
        y
      </text>

      {ghostSegment && (
        <line
          x1={toX(ghostSegment[0][0])}
          y1={toY(ghostSegment[0][1])}
          x2={toX(ghostSegment[1][0])}
          y2={toY(ghostSegment[1][1])}
          stroke="#0B2A5B"
          strokeOpacity={0.4}
          strokeWidth={3}
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      )}

      {segment && (
        <>
          <line
            x1={toX(segment[0][0])}
            y1={toY(segment[0][1])}
            x2={toX(segment[1][0])}
            y2={toY(segment[1][1])}
            stroke="#fff"
            strokeOpacity={0.75}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <line
            x1={toX(segment[0][0])}
            y1={toY(segment[0][1])}
            x2={toX(segment[1][0])}
            y2={toY(segment[1][1])}
            stroke="#0B2A5B"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}

      {points.map((p, i) => (
        <TargetPointMark key={i} px={toX(p.x)} py={toY(p.y)} hit={p.hit} />
      ))}
    </svg>
  );
}

function TargetPointMark({ px, py, hit }: { px: number; py: number; hit: boolean }) {
  if (!hit) {
    return <circle cx={px} cy={py} r={7.9} fill="#FF8A3D" stroke="#0B2A5B" strokeWidth={2.5} />;
  }

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const inner = CELL * 0.9;
    const outer = CELL * 1.08;
    return {
      x1: px + Math.cos(angle) * inner,
      y1: py + Math.sin(angle) * inner,
      x2: px + Math.cos(angle) * outer,
      y2: py + Math.sin(angle) * outer,
    };
  });

  return (
    <g>
      <circle cx={px} cy={py} r={CELL * 1.55} fill="#DDF55A" opacity={0.3} />
      <circle cx={px} cy={py} r={CELL} fill="#DDF55A" opacity={0.65} />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#0B2A5B" strokeWidth={2} strokeLinecap="round" />
      ))}
      <circle cx={px} cy={py} r={11.8} fill="#DDF55A" stroke="#0B2A5B" strokeWidth={2.5} />
    </g>
  );
}
