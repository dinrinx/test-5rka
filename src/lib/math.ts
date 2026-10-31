export const HIT_EPSILON = 1e-9;

export function isOnLine(k: number, b: number, x: number, y: number): boolean {
  return Math.abs(k * x + b - y) < HIT_EPSILON;
}

export function hitsForLine(k: number, b: number, points: readonly [number, number][]): boolean[] {
  return points.map(([x, y]) => isOnLine(k, b, x, y));
}

/**
 * Парсит число, введённое в текстовое поле. Принимает юникод-минус,
 * запятую как десятичный разделитель и простые дроби вида "1/2".
 */
export function parseFlexibleNumber(raw: string): number | null {
  if (!raw) return null;
  let s = raw.trim();
  if (s === '') return null;
  // Юникод-минус (U+2212) и похожие тире -> обычный дефис.
  s = s.replace(/[−‒–—]/g, '-');
  s = s.replace(/\s+/g, '');

  const fractionMatch = /^(-?)(\d+)\/(\d+)$/.exec(s);
  if (fractionMatch) {
    const sign = fractionMatch[1] === '-' ? -1 : 1;
    const num = Number(fractionMatch[2]);
    const den = Number(fractionMatch[3]);
    if (den === 0) return null;
    return sign * (num / den);
  }

  // Запятая как десятичный разделитель (только одна).
  if (s.includes(',')) {
    if (s.split(',').length > 2) return null;
    s = s.replace(',', '.');
  }

  if (!/^-?\d*\.?\d+$/.test(s)) return null;
  const value = Number(s);
  return Number.isFinite(value) ? value : null;
}

export function formatCoef(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toString().replace('.', ',');
}
