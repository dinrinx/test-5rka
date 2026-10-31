import type { Progress } from '../types';

const STORAGE_KEY = 'pryamaya:progress';

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.currentLevel === 'number' &&
      Array.isArray(parsed.rules)
    ) {
      return {
        currentLevel: parsed.currentLevel,
        rules: parsed.rules,
        stars: Array.isArray(parsed.stars) ? parsed.stars : Array(10).fill(0),
        hintsUsed: Array.isArray(parsed.hintsUsed) ? parsed.hintsUsed : Array(10).fill(0),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Работаем без сохранения.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Работаем без сохранения.
  }
}
