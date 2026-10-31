export type Coef = 'k' | 'b';

export type LevelMode = 'slider' | 'input';

export interface LevelConfig {
  id: number;
  mode: LevelMode;
  /** Какие коэффициенты ученик меняет сам. */
  active: Coef[];
  /** Значения заблокированных коэффициентов (для slider-уровней с одним активным). */
  fixed: Partial<Record<Coef, number>>;
  /** Стартовые значения активных коэффициентов (slider-режим). */
  start: Partial<Record<Coef, number>>;
  target: { k: number; b: number };
  points: [number, number][];
  taskText: string;
  rule?: RuleId;
}

export type RuleId = 'R1' | 'R2' | 'R3' | 'R4';

export interface RuleDef {
  id: RuleId;
  text: string;
}

export interface Progress {
  currentLevel: number;
  rules: RuleId[];
  /** Звёзды за каждый из 10 уровней (0, если ещё не пройден). */
  stars: number[];
  /** Сколько подсказок использовано на каждом из 10 уровней. */
  hintsUsed: number[];
}

export type MascotState = 'idle' | 'happy' | 'sad';

export interface LevelResult {
  rule?: RuleId;
  stars: number;
  hintsUsed: number;
}
