import type { LevelConfig, RuleDef } from '../types';

const TASK_MOVE = 'Сдвинь прямую так, чтобы она прошла через точки';
const TASK_SLOPE = 'Поменяй наклон прямой';
const TASK_BOTH = 'Проведи прямую через все точки';
const TASK_INPUT = 'Найди k и b без слайдеров';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    mode: 'slider',
    active: ['b'],
    fixed: { k: 1 },
    start: { b: 0 },
    target: { k: 1, b: 3 },
    points: [
      [0, 3],
      [-2, 1],
    ],
    taskText: TASK_MOVE,
    rule: 'R1',
  },
  {
    id: 2,
    mode: 'slider',
    active: ['b'],
    fixed: { k: 2 },
    start: { b: 0 },
    target: { k: 2, b: -3 },
    points: [
      [0, -3],
      [2, 1],
    ],
    taskText: TASK_MOVE,
  },
  {
    id: 3,
    mode: 'slider',
    active: ['k'],
    fixed: { b: 1 },
    start: { k: 0.5 },
    target: { k: 2, b: 1 },
    points: [
      [1, 3],
      [-2, -3],
    ],
    taskText: TASK_SLOPE,
    rule: 'R2',
  },
  {
    id: 4,
    mode: 'slider',
    active: ['k'],
    fixed: { b: 2 },
    start: { k: 1 },
    target: { k: -1, b: 2 },
    points: [
      [2, 0],
      [-2, 4],
    ],
    taskText: TASK_SLOPE,
    rule: 'R3',
  },
  {
    id: 5,
    mode: 'slider',
    active: ['k'],
    fixed: { b: -2 },
    start: { k: 1 },
    target: { k: 0, b: -2 },
    points: [
      [-3, -2],
      [3, -2],
    ],
    taskText: TASK_SLOPE,
    rule: 'R4',
  },
  {
    id: 6,
    mode: 'slider',
    active: ['k', 'b'],
    fixed: {},
    start: { k: 1, b: 0 },
    target: { k: 0.5, b: 1 },
    points: [
      [2, 2],
      [-4, -1],
    ],
    taskText: TASK_BOTH,
  },
  {
    id: 7,
    mode: 'slider',
    active: ['k', 'b'],
    fixed: {},
    start: { k: 1, b: 0 },
    target: { k: -2, b: 3 },
    points: [
      [0, 3],
      [1, 1],
      [3, -3],
    ],
    taskText: TASK_BOTH,
  },
  {
    id: 8,
    mode: 'slider',
    active: ['k', 'b'],
    fixed: {},
    start: { k: 1, b: 0 },
    target: { k: -0.5, b: -2 },
    points: [
      [-4, 0],
      [2, -3],
    ],
    taskText: TASK_BOTH,
  },
  {
    id: 9,
    mode: 'input',
    active: ['k', 'b'],
    fixed: {},
    start: {},
    target: { k: 3, b: -1 },
    points: [
      [0, -1],
      [1, 2],
    ],
    taskText: TASK_INPUT,
  },
  {
    id: 10,
    mode: 'input',
    active: ['k', 'b'],
    fixed: {},
    start: {},
    target: { k: -1.5, b: 2 },
    points: [
      [0, 2],
      [2, -1],
    ],
    taskText: TASK_INPUT,
  },
];

export const RULES: RuleDef[] = [
  { id: 'R1', text: 'b — точка, где прямая пересекает ось Y. Меняешь b — прямая сдвигается вверх-вниз' },
  { id: 'R2', text: 'k — наклон. Чем больше k, тем круче прямая. k показывает, на сколько растёт y, когда x растёт на 1' },
  { id: 'R3', text: 'Если k < 0, прямая идёт вниз слева направо' },
  { id: 'R4', text: 'Если k = 0, прямая горизонтальна: y = b при любом x' },
];

export function getLevel(id: number): LevelConfig {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) throw new Error(`Level ${id} not found`);
  return level;
}
