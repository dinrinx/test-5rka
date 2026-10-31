import type { LevelMode } from '../types';

interface StarInput {
  mode: LevelMode;
  hintsUsed: number;
  movements: number;
  attempts: number;
}

/**
 * Правила из SPEC:
 * slider: ★★★ — без подсказок и ≤10 движений; ★★ — подсказки 1–2 или >10 движений; ★ — показан призрак (подсказка 3).
 * input:  ★★★ — с первой попытки; ★★ — со второй; ★ — дальше или с призраком.
 */
export function calcStars({ mode, hintsUsed, movements, attempts }: StarInput): number {
  const ghostShown = hintsUsed >= 3;

  if (mode === 'slider') {
    if (ghostShown) return 1;
    if (hintsUsed >= 1 || movements > 10) return 2;
    return 3;
  }

  if (ghostShown || attempts >= 3) return 1;
  if (attempts === 2) return 2;
  return 3;
}

export function movementsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = 'движений';
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = 'движение';
    else if (mod10 >= 2 && mod10 <= 4) word = 'движения';
  }
  return `${n} ${word}`;
}

export function attemptLabel(n: number): string {
  if (n <= 1) return 'С первой попытки';
  if (n === 2) return 'Со второй попытки';
  return `С ${n}-й попытки`;
}
