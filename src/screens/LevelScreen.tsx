import { useEffect, useMemo, useState } from 'react';
import { Formula } from '../components/Formula';
import { GraphSVG } from '../components/GraphSVG';
import { InputRow } from '../components/InputRow';
import { ProgressBar } from '../components/ProgressBar';
import { SliderRow } from '../components/SliderRow';
import { ArrowRightIcon, RulesIcon } from '../components/icons';
import { RULES } from '../data/levels';
import { hitsForLine, parseFlexibleNumber } from '../lib/math';
import type { LevelConfig, RuleId } from '../types';

interface LevelScreenProps {
  level: LevelConfig;
  rulesOpened: RuleId[];
  onComplete: (rule?: RuleId) => void;
}

const K_RANGE = { min: -3, max: 3, step: 0.5 };
const B_RANGE = { min: -5, max: 5, step: 1 };
const INPUT_STEP = 0.5;

export function LevelScreen({ level, rulesOpened, onComplete }: LevelScreenProps) {
  const [k, setK] = useState(() => level.fixed.k ?? level.start.k ?? 0);
  const [b, setB] = useState(() => level.fixed.b ?? level.start.b ?? 0);
  const [rawK, setRawK] = useState('');
  const [rawB, setRawB] = useState('');
  const [committed, setCommitted] = useState<{ k: number; b: number } | null>(null);
  const [solved, setSolved] = useState(false);

  const activeK = level.active.includes('k');
  const activeB = level.active.includes('b');
  const isInput = level.mode === 'input';

  // Сброс состояния при переходе на новый уровень.
  useEffect(() => {
    setK(level.fixed.k ?? level.start.k ?? 0);
    setB(level.fixed.b ?? level.start.b ?? 0);
    setRawK('');
    setRawB('');
    setCommitted(null);
    setSolved(false);
  }, [level.id]);

  const displayK = isInput ? committed?.k ?? 0 : k;
  const displayB = isInput ? committed?.b ?? 0 : b;

  const hits = useMemo(() => {
    if (isInput && !committed) return level.points.map(() => false);
    return hitsForLine(displayK, displayB, level.points);
  }, [displayK, displayB, isInput, committed, level.points]);

  const allHit = hits.every(Boolean);

  // Slider-режим: засчитываем автоматически.
  useEffect(() => {
    if (isInput || solved) return;
    if (allHit) {
      const timer = setTimeout(() => setSolved(true), 420);
      return () => clearTimeout(timer);
    }
  }, [allHit, isInput, solved]);

  // Input-режим: засчитываем после успешной проверки.
  useEffect(() => {
    if (!isInput || solved || !committed) return;
    if (allHit) {
      const timer = setTimeout(() => setSolved(true), 300);
      return () => clearTimeout(timer);
    }
  }, [allHit, isInput, solved, committed]);

  useEffect(() => {
    if (isInput || solved) return;
    function onKeyDown(e: KeyboardEvent) {
      if (activeK && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        setK((prev) => clamp(prev + (e.key === 'ArrowRight' ? K_RANGE.step : -K_RANGE.step), K_RANGE.min, K_RANGE.max));
      } else if (activeB && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        setB((prev) => clamp(prev + (e.key === 'ArrowUp' ? B_RANGE.step : -B_RANGE.step), B_RANGE.min, B_RANGE.max));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeK, activeB, isInput, solved]);

  const parsedK = parseFlexibleNumber(rawK);
  const parsedB = parseFlexibleNumber(rawB);
  const canCheck = parsedK !== null && parsedB !== null;

  function handleCheck() {
    if (parsedK === null || parsedB === null) return;
    setCommitted({ k: parsedK, b: parsedB });
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

  return (
    <div className="scene">
      <div className="level-shell">
        <div className="level-graph-wrap">
          <div className="glass" style={{ borderRadius: 28, boxSizing: 'border-box', padding: 10, aspectRatio: '1 / 1', width: '100%' }}>
            <GraphSVG
              k={displayK}
              b={displayB}
              points={level.points.map(([x, y], i) => ({ x, y, hit: hits[i] }))}
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
              {activeK && <SliderRow coef="k" value={k} min={K_RANGE.min} max={K_RANGE.max} step={K_RANGE.step} onChange={setK} />}
              {activeB && <SliderRow coef="b" value={b} min={B_RANGE.min} max={B_RANGE.max} step={B_RANGE.step} onChange={setB} />}
              <div className="keyboard-hint">← → ↑ ↓ для управления</div>
            </>
          )}
        </div>

        {solved && (
          <div className="success-sheet">
            {rule && !ruleAlreadyOpen && <span className="chip">Правило открыто</span>}
            {rule && (
              <div style={{ fontFamily: "'Unbounded','Manrope',sans-serif", fontWeight: 600, fontSize: 17, lineHeight: '26px', color: 'var(--ink)' }}>
                {rule.text}
              </div>
            )}
            <button type="button" className="btn btn-primary" onClick={() => onComplete(level.rule)}>
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
