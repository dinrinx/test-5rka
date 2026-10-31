export const GRID_MIN = -5;
export const GRID_MAX = 5;
export const SVG_SIZE = 338;
export const PAD = 22;
export const INNER = SVG_SIZE - PAD * 2;
export const CELL = INNER / (GRID_MAX - GRID_MIN);

export function toX(v: number): number {
  return PAD + (v - GRID_MIN) * CELL;
}

export function toY(v: number): number {
  return PAD + (GRID_MAX - v) * CELL;
}

/** Обрезает прямую y = kx + b по квадрату сетки [min, max] x [min, max]. */
export function clipLineToGrid(
  k: number,
  b: number,
  min = GRID_MIN,
  max = GRID_MAX,
): [[number, number], [number, number]] | null {
  const eps = 1e-6;
  const candidates: [number, number][] = [];

  const push = (x: number, y: number) => {
    if (x >= min - eps && x <= max + eps && y >= min - eps && y <= max + eps) {
      candidates.push([x, y]);
    }
  };

  push(min, k * min + b);
  push(max, k * max + b);
  if (k !== 0) {
    push((min - b) / k, min);
    push((max - b) / k, max);
  }

  const unique: [number, number][] = [];
  for (const c of candidates) {
    if (!unique.some(([ux, uy]) => Math.abs(ux - c[0]) < 1e-4 && Math.abs(uy - c[1]) < 1e-4)) {
      unique.push(c);
    }
  }
  if (unique.length < 2) return null;

  let best: [[number, number], [number, number]] = [unique[0], unique[1]];
  let bestDist = -1;
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const dx = unique[i][0] - unique[j][0];
      const dy = unique[i][1] - unique[j][1];
      const dist = dx * dx + dy * dy;
      if (dist > bestDist) {
        bestDist = dist;
        best = [unique[i], unique[j]];
      }
    }
  }
  return best;
}
