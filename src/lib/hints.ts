import type { LevelConfig } from '../types';

/**
 * Текст первой подсказки (направление): сравнивает текущие k/b с целью
 * и говорит, в какую сторону двигаться.
 */
export function directionHint(level: LevelConfig, k: number, b: number): string {
  const { target, active } = level;

  if (active.includes('b') && b !== target.b) {
    return b > target.b ? 'Прямая выше точек — уменьши b' : 'Прямая ниже точек — увеличь b';
  }

  const wrongSign = target.k !== 0 && Math.sign(k) !== Math.sign(target.k) && k !== target.k;
  if (wrongSign) {
    return target.k > 0 ? 'Прямая должна идти вверх' : 'Прямая должна идти вниз';
  }
  if (Math.abs(k) < Math.abs(target.k)) {
    return 'Сделай прямую круче';
  }
  if (Math.abs(k) > Math.abs(target.k)) {
    return 'Сделай прямую положе';
  }
  return 'Почти готово — сверься с точками';
}

/** Текст второй подсказки (принцип). */
export function principleHint(level: LevelConfig): string {
  const hasYAxisPoint = level.points.some(([x]) => x === 0);
  if (hasYAxisPoint) {
    return 'Одна точка лежит на оси Y — значит, b равно её y';
  }
  return 'Посмотри, на сколько растёт y, когда x растёт на 1 — это и есть k';
}

export const GHOST_HINT_TEXT = 'Пунктирная линия — где должна пройти прямая';

export function hintText(level: LevelConfig, hintLevel: number, k: number, b: number): string {
  if (hintLevel === 1) return directionHint(level, k, b);
  if (hintLevel === 2) return principleHint(level);
  return GHOST_HINT_TEXT;
}

/** Разбор ошибки в input-режиме: сравнение введённых k/b с целевыми. */
export function errorBreakdown(level: LevelConfig, k: number, b: number): string {
  const parts: string[] = [];
  for (const coef of ['k', 'b'] as const) {
    const entered = coef === 'k' ? k : b;
    const target = coef === 'k' ? level.target.k : level.target.b;
    const diff = round(entered - target);
    if (diff === 0) {
      parts.push(`${coef} верный ✓`);
    } else if (diff > 0) {
      parts.push(`${coef} больше на ${formatDiff(diff)}`);
    } else {
      parts.push(`${coef} меньше на ${formatDiff(-diff)}`);
    }
  }
  return parts.join(' · ');
}

function round(v: number): number {
  return Math.round(v * 1000) / 1000;
}

function formatDiff(v: number): string {
  return round(v).toString().replace('.', ',');
}
