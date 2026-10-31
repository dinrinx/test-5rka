import { useEffect, useMemo, useRef, useState } from 'react';
import { Formula } from '../components/Formula';
import { GraphSVG } from '../components/GraphSVG';
import { InputRow } from '../components/InputRow';
import { Mascot } from '../components/Mascot';
import { ProgressBar } from '../components/ProgressBar';
import { SliderRow } from '../components/SliderRow';
import { SpeechBubble } from '../components/SpeechBubble';
import { StarsRow } from '../components/StarsRow';
import { ArrowRightIcon, RulesIcon } from '../components/icons';
import { RULES } from '../data/levels';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { clipLineToGrid, toX, toY } from '../lib/graph';
import { errorBreakdown, hintText } from '../lib/hints';
import { hitsForLine, parseFlexibleNumber } from '../lib/math';
import { attemptLabel, calcStars, movementsLabel } from '../lib/stars';
import type { LevelConfig, LevelResult, MascotState, RuleId } from '../types';

interface LevelScreenProps {
  level: LevelConfig;
  rulesOpened: RuleId[];
  onComplete: (result: LevelResult) => void;
}

const K_RANGE = { min: -3, max: 3, step: 0.5 };
const B_RANGE = { min: -5, max: 5, step: 1 };
const INPUT_STEP = 0.5;
const ROLL_DURATION = 1200;
const HINT_TIMEOUT = 20000;
const HINT_MOVEMENTS_THRESHOLD = 15;

interface MascotMark {
  xPx: number;
  yPx: number;
  rotationDeg: number;
  state: MascotState;
}

export function LevelScreen({ level, rulesOpened, onComplete }: LevelScreenProps) {
  const reducedMotion = useReducedMotion();

  const [k, setKRaw] = useState(() => level.fixed.k ?? level.start.k ?? 0);
  const [b, setBRaw] = useState(() => level.fixed.b ?? level.start.b ?? 0);
  const [rawK, setRawK] = useState('');
  const [rawB, setRawB] = useState('');
  const [committed, setCommitted] = useState<{ k: number; b: number } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [movements, setMovements] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintEligible, setHintEligible] = useState(false);
  const [solved, setSolved] = useState(false);
  const [result, setResult] = useState<{ stars: number; hintsUsed: number; movements: number; attempts: number } | null>(null);
  const [mascotMark, setMascotMark] = useState<MascotMark | null>(null);

  const rollRef = useRef<number | null>(null);
  const resolvingRef = useRef(false);
  const checkLockRef = useRef(false);
  const nextLockRef = useRef(false);
  const movementsRef = useRef(movements);
  const hintLevelRef = useRef(hintLevel);
  movementsRef.current = movements;
  hintLevelRef.current = hintLevel;

  const activeK = level.active.includes('k');
  const activeB = level.active.includes('b');
  const isInput = level.mode === 'input';

  // Сброс состояния при переходе на новый уровень.
  useEffect(() => {
    setKRaw(level.fixed.k ?? level.start.k ?? 0);
    setBRaw(level.fixed.b ?? level.start.b ?? 0);
    setRawK('');
    setRawB('');
    setCommitted(null);
    setAttempts(0);
    setMovements(0);
    setHintLevel(0);
    setHintEligible(false);
    setSolved(false);
    setResult(null);
    setMascotMark(null);
    resolvingRef.current = false;
    if (rollRef.current) cancelAnimationFrame(rollRef.current);
  }, [level.id]);

  const displayK = isInput ? committed?.k ?? 0 : k;
  const displayB = isInput ? committed?.b ?? 0 : b;

  const hits = useMemo(() => {
    if (isInput && !committed) return level.points.map(() => false);
    return hitsForLine(displayK, displayB, level.points);
  }, [displayK, displayB, isInput, committed, level.points]);

  const allHit = hits.every(Boolean);
  const wrongAttempt = isInput && committed !== null && !allHit;

  // Подсказка становится доступна через 20с или 15 движений (slider),
  // либо после первой неверной попытки (input).
  useEffect(() => {
    if (isInput || solved) return;
    const timer = setTimeout(() => setHintEligible(true), HINT_TIMEOUT);
    return () => clearTimeout(timer);
  }, [level.id, isInput, solved]);

  useEffect(() => {
    if (!isInput && movements >= HINT_MOVEMENTS_THRESHOLD) setHintEligible(true);
  }, [movements, isInput]);

  useEffect(() => {
    if (isInput && attempts >= 1) setHintEligible(true);
  }, [isInput, attempts]);

  function startSolve(finalAttempts: number) {
    if (resolvingRef.current) return;
    resolvingRef.current = true;

    const finalHints = hintLevelRef.current;
    const finalMovements = movementsRef.current;
    const stars = calcStars({ mode: level.mode, hintsUsed: finalHints, movements: finalMovements, attempts: finalAttempts });
    const finish = () => {
      setResult({ stars, hintsUsed: finalHints, movements: finalMovements, attempts: finalAttempts });
      setSolved(true);
      setMascotMark(null);
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const segment = clipLineToGrid(level.target.k, level.target.b);
    if (!segment) {
      finish();
      return;
    }
    const p1 = { x: toX(segment[0][0]), y: toY(segment[0][1]) };
    const p2 = { x: toX(segment[1][0]), y: toY(segment[1][1]) };
    const left = p1.x <= p2.x ? p1 : p2;
    const right = p1.x <= p2.x ? p2 : p1;
    const dx = right.x - left.x;
    const dy = right.y - left.y;
    const distance = Math.hypot(dx, dy);
    const radiusPx = 50 * 0.3; // соответствует MASCOT_SCALE в GraphSVG
    const totalRotation = (distance / radiusPx) * (180 / Math.PI);

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ROLL_DURATION);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setMascotMark({
        xPx: left.x + dx * eased,
        yPx: left.y + dy * eased,
        rotationDeg: totalRotation * eased,
        state: 'happy',
      });
      if (t < 1) {
        rollRef.current = requestAnimationFrame(step);
      } else {
        finish();
      }
    };
    rollRef.current = requestAnimationFrame(step);
  }

  // Slider-режим: засчитываем автоматически.
  useEffect(() => {
    if (isInput || solved || resolvingRef.current) return;
    if (allHit) {
      const timer = setTimeout(() => startSolve(0), 320);
      return () => clearTimeout(timer);
    }
  }, [allHit, isInput, solved]);

  useEffect(
    () => () => {
      if (rollRef.current) cancelAnimationFrame(rollRef.current);
    },
    [],
  );

  useEffect(() => {
    if (isInput || solved) return;
    function onKeyDown(e: KeyboardEvent) {
      if (activeK && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const next = clamp(k + (e.key === 'ArrowRight' ? K_RANGE.step : -K_RANGE.step), K_RANGE.min, K_RANGE.max);
        if (next !== k) setMovements((m) => m + 1);
        setKRaw(next);
      } else if (activeB && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const next = clamp(b + (e.key === 'ArrowUp' ? B_RANGE.step : -B_RANGE.step), B_RANGE.min, B_RANGE.max);
        if (next !== b) setMovements((m) => m + 1);
        setBRaw(next);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeK, activeB, isInput, solved, k, b]);

  function handleKChange(value: number) {
    if (value !== k) setMovements((m) => m + 1);
    setKRaw(value);
  }

  function handleBChange(value: number) {
    if (value !== b) setMovements((m) => m + 1);
    setBRaw(value);
  }

  const parsedK = parseFlexibleNumber(rawK);
  const parsedB = parseFlexibleNumber(rawB);
  const canCheck = parsedK !== null && parsedB !== null && !solved;

  function handleCheck() {
    if (parsedK === null || parsedB === null || solved || resolvingRef.current || checkLockRef.current) return;
    checkLockRef.current = true;
    setTimeout(() => {
      checkLockRef.current = false;
    }, 400);

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setCommitted({ k: parsedK, b: parsedB });
    const willHit = hitsForLine(parsedK, parsedB, level.points).every(Boolean);
    if (willHit) {
      setTimeout(() => startSolve(nextAttempts), 260);
    }
  }

  function handleStep(coef: 'k' | 'b', dir: 1 | -1) {
    if (coef === 'k') {
      const base = parsedK ?? 0;
      setRawK(String(round2(base + dir * INPUT_STEP)).replace('.', ','));
    } else {
      const base = parsedB ?? 0;
      setRawB(String(round2(base + dir * INPUT_STEP)).replace('.', ','));
    }
  }

  const rule = level.rule ? RULES.find((r) => r.id === level.rule) : undefined;
  const ruleAlreadyOpen = level.rule ? rulesOpened.includes(level.rule) : false;

  const ghost = hintLevel >= 3 ? { k: level.target.k, b: level.target.b } : null;

  function handleComplete() {
    if (!result || nextLockRef.current) return;
    nextLockRef.current = true;
    onComplete({ rule: level.rule, stars: result.stars, hintsUsed: result.hintsUsed });
  }

  return (
    <div className="scene">
      <div className="level-shell">
        <div className="level-graph-wrap">
          <div className="glass" style={{ borderRadius: 28, boxSizing: 'border-box', padding: 10, aspectRatio: '1 / 1', width: '100%' }}>
            <GraphSVG
              k={displayK}
              b={displayB}
              points={level.points.map(([x, y], i) => ({ x, y, hit: hits[i] }))}
              ghost={ghost}
              mascot={mascotMark}
              ariaLabel="График, сетка от −5 до 5"
            />
          </div>
        </div>

        <div className="level-panel">
          <div className="level-header">
            <div style={{ font: "700 14px/1 'Manrope',sans-serif", color: 'var(--ink)' }}>Уровень {level.id} из 10</div>
            <span className="chip chip--ghost">
              <RulesIcon />
              Правила: {rulesOpened.length}/4
            </span>
          </div>

          <ProgressBar percent={(level.id / 10) * 100} />

          <div style={{ font: "800 17px/22px 'Manrope',sans-serif", color: 'var(--ink)', flex: 'none' }}>{level.taskText}</div>

          <Formula k={displayK} b={displayB} activeK={activeK} activeB={activeB} />

          {isInput ? (
            <>
              <InputRow coef="k" raw={rawK} valid={parsedK !== null} onChange={setRawK} onStep={(d) => handleStep('k', d)} />
              <InputRow coef="b" raw={rawB} valid={parsedB !== null} onChange={setRawB} onStep={(d) => handleStep('b', d)} />
              <button type="button" className="btn btn-primary" disabled={!canCheck} onClick={handleCheck}>
                Проверить
                <ArrowRightIcon />
              </button>
            </>
          ) : (
            <>
              {activeK && <SliderRow coef="k" value={k} min={K_RANGE.min} max={K_RANGE.max} step={K_RANGE.step} onChange={handleKChange} />}
              {activeB && <SliderRow coef="b" value={b} min={B_RANGE.min} max={B_RANGE.max} step={B_RANGE.step} onChange={handleBChange} />}
              <div className="keyboard-hint">← → ↑ ↓ для управления</div>
            </>
          )}

          {!solved && hintLevel >= 1 && (
            <SpeechBubble
              mascotState="idle"
              action={
                hintLevel < 3 ? (
                  <button type="button" className="btn-ghost" onClick={() => setHintLevel((h) => Math.min(3, h + 1))}>
                    Ещё подсказка
                  </button>
                ) : undefined
              }
            >
              {hintText(level, hintLevel, displayK, displayB)}
            </SpeechBubble>
          )}

          {!solved && hintLevel === 0 && wrongAttempt && (
            <SpeechBubble
              mascotState="sad"
              action={
                <button type="button" className="btn-ghost" onClick={() => setHintLevel(1)}>
                  Подсказка
                </button>
              }
            >
              {committed ? errorBreakdown(level, committed.k, committed.b) : ''}
            </SpeechBubble>
          )}

          {!solved && hintLevel === 0 && !wrongAttempt && hintEligible && (
            <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setHintLevel(1)}>
              Подсказка
              <ArrowRightIcon size={16} />
            </button>
          )}
        </div>

        {solved && result && (
          <div className="success-sheet">
            {rule && !ruleAlreadyOpen && <span className="chip">Правило открыто</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mascot state="happy" size={36} />
              <div style={{ fontFamily: "'Unbounded','Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>Отлично!</div>
            </div>
            {rule && (
              <div style={{ fontFamily: "'Unbounded','Manrope',sans-serif", fontWeight: 600, fontSize: 17, lineHeight: '26px', color: 'var(--ink)' }}>
                {rule.text}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <StarsRow count={result.stars} />
              <div style={{ font: "600 13px/18px 'Manrope',sans-serif", color: 'var(--ink-soft)' }}>
                {isInput
                  ? `${attemptLabel(result.attempts)}${result.hintsUsed > 0 ? ' · с подсказками' : ''}`
                  : `${result.hintsUsed === 0 ? 'Без подсказок' : 'С подсказками'} · ${movementsLabel(result.movements)}`}
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleComplete}>
              Дальше
              <ArrowRightIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
