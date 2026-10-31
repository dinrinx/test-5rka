import { useState } from 'react';
import { getLevel } from './data/levels';
import { clearProgress, loadProgress, saveProgress } from './lib/storage';
import { LevelScreen } from './screens/LevelScreen';
import { ResultScreen } from './screens/ResultScreen';
import { StartScreen } from './screens/StartScreen';
import type { Progress, RuleId } from './types';

type Screen = 'start' | 'level' | 'result';

function emptyProgress(): Progress {
  return { currentLevel: 1, rules: [] };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [progress, setProgress] = useState<Progress>(() => loadProgress() ?? emptyProgress());
  const storedProgress = loadProgress();

  function startLevel(levelId: number, base: Progress) {
    const next = { ...base, currentLevel: levelId };
    setProgress(next);
    saveProgress(next);
    setScreen('level');
  }

  function handleStart() {
    const fresh = emptyProgress();
    setProgress(fresh);
    saveProgress(fresh);
    startLevel(1, fresh);
  }

  function handleContinue() {
    const existing = loadProgress() ?? emptyProgress();
    startLevel(existing.currentLevel, existing);
  }

  function handleRestart() {
    clearProgress();
    const fresh = emptyProgress();
    setProgress(fresh);
    setScreen('start');
  }

  function handleLevelComplete(rule?: RuleId) {
    const rules = rule && !progress.rules.includes(rule) ? [...progress.rules, rule] : progress.rules;
    if (progress.currentLevel >= 10) {
      const finished: Progress = { currentLevel: 10, rules };
      setProgress(finished);
      saveProgress(finished);
      setScreen('result');
      return;
    }
    const next: Progress = { currentLevel: progress.currentLevel + 1, rules };
    setProgress(next);
    saveProgress(next);
  }

  if (screen === 'start') {
    return <StartScreen progress={storedProgress} onStart={handleStart} onContinue={handleContinue} onRestart={handleRestart} />;
  }

  if (screen === 'result') {
    return <ResultScreen rulesOpened={progress.rules} onRestart={handleRestart} />;
  }

  const level = getLevel(progress.currentLevel);
  return <LevelScreen key={level.id} level={level} rulesOpened={progress.rules} onComplete={handleLevelComplete} />;
}
