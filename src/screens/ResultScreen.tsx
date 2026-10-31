import { useState } from 'react';
import { ArrowRightIcon } from '../components/icons';
import { RULES } from '../data/levels';
import type { RuleId } from '../types';

interface ResultScreenProps {
  rulesOpened: RuleId[];
  stars: number[];
  hintsUsed: number[];
  onRestart: () => void;
}

export function ResultScreen({ rulesOpened, stars, hintsUsed, onRestart }: ResultScreenProps) {
  const [toast, setToast] = useState(false);
  const totalStars = stars.reduce((sum, s) => sum + s, 0);
  const noHintLevels = hintsUsed.filter((h) => h === 0).length;

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: 'Прямая — тренажёр по линейной функции',
      text: 'Я прошёл тренажёр «Прямая» — попробуй разобраться, как работает y = kx + b!',
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // Пользователь отменил или API недоступен — переходим к фолбэку.
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    } catch {
      // Буфер обмена недоступен — молча игнорируем.
    }
  }

  return (
    <div className="scene">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          padding: '72px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxWidth: 480,
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        <div style={{ fontFamily: "'Unbounded','Manrope',sans-serif", fontWeight: 700, fontSize: 72, lineHeight: '80px', color: 'var(--ink)', textAlign: 'center', flex: 'none', letterSpacing: '-.02em' }}>
          10/10
        </div>
        <div style={{ font: "600 15px/22px 'Manrope',sans-serif", color: 'var(--ink-soft)', textAlign: 'center', flex: 'none' }}>
          уровней пройдено
        </div>

        <span className="chip">★ {totalStars} из 30</span>
        <div style={{ font: "600 14px/20px 'Manrope',sans-serif", color: 'var(--ink-soft)', textAlign: 'center', flex: 'none' }}>
          Без подсказок: {noHintLevels}
        </div>

        <div style={{ height: 6, flex: 'none' }} />
        <div style={{ fontFamily: "'Unbounded','Manrope',sans-serif", fontWeight: 600, fontSize: 15, lineHeight: '24px', color: 'var(--ink)', flex: 'none', alignSelf: 'flex-start' }}>
          Правила: {rulesOpened.length}/4
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 'none', width: '100%' }}>
          {RULES.map((r) => {
            const opened = rulesOpened.includes(r.id);
            return (
              <div
                key={r.id}
                className={opened ? 'glass glass--strong' : 'glass glass--dashed'}
                style={{
                  borderRadius: 24,
                  width: 'calc(50% - 5px)',
                  height: 150,
                  boxSizing: 'border-box',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 13,
                    background: r.id === 'R1' || r.id === 'R4' ? 'var(--color-b)' : 'var(--color-k)',
                    color: r.id === 'R1' || r.id === 'R4' ? 'var(--ink)' : '#fff',
                    font: "800 12px/1 'Manrope',sans-serif",
                    opacity: opened ? 1 : 0.55,
                  }}
                >
                  {r.id}
                </span>
                <div style={{ font: "600 13px/1.3 'Manrope',sans-serif", color: 'var(--ink)', opacity: opened ? 1 : 0.55 }}>
                  {opened ? r.text : 'Пройди уровень, чтобы открыть правило'}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Пройти заново
          <ArrowRightIcon />
        </button>
        <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={handleShare}>
          Поделиться
        </button>
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,.92)',
            color: 'var(--ink)',
            padding: '10px 18px',
            borderRadius: 16,
            font: "700 13px/1 'Manrope',sans-serif",
            boxShadow: '0 14px 30px rgba(14,60,140,.24)',
          }}
        >
          Ссылка скопирована
        </div>
      )}
    </div>
  );
}
