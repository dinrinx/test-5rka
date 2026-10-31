import { GraphSVG } from '../components/GraphSVG';
import { ArrowRightIcon } from '../components/icons';
import type { Progress } from '../types';

interface StartScreenProps {
  progress: Progress | null;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
}

export function StartScreen({ progress, onStart, onContinue, onRestart }: StartScreenProps) {
  const hasProgress = !!progress && progress.currentLevel > 1;

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
          gap: 18,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <div style={{ flex: 'none' }}>
          <span className="chip">Алгебра · 7–8 класс</span>
        </div>
        <h1
          style={{
            fontFamily: "'Unbounded','Manrope',sans-serif",
            fontWeight: 700,
            fontSize: 30,
            lineHeight: '38px',
            margin: 0,
            color: 'var(--ink)',
            flex: 'none',
            letterSpacing: '-.01em',
          }}
        >
          Разберись,
          <br />
          как работает
          <br />
          y ={' '}
          <span style={{ display: 'inline-block', background: 'var(--color-k)', color: '#fff', borderRadius: '.34em', padding: '.02em .24em .06em', lineHeight: 1.1 }}>
            k
          </span>
          x +{' '}
          <span style={{ display: 'inline-block', background: 'var(--color-b)', color: 'var(--ink)', borderRadius: '.34em', padding: '.02em .24em .06em', lineHeight: 1.1 }}>
            b
          </span>
        </h1>
        <div style={{ font: "500 14px/20px 'Manrope',sans-serif", color: 'var(--ink-soft)', flex: 'none' }}>
          10 уровней · ~10 минут · без регистрации
        </div>
        <div style={{ flex: 1 }} />
        <div
          className="glass"
          style={{
            borderRadius: 32,
            width: '100%',
            maxWidth: 342,
            aspectRatio: '1 / 1',
            margin: '0 auto',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
            padding: 20,
          }}
        >
          <GraphSVG
            k={1}
            b={2}
            points={[
              { x: -2, y: 0, hit: true },
              { x: 2, y: 4, hit: true },
            ]}
            ariaLabel="Мини-график прямой"
          />
        </div>
        <div style={{ height: 10, flex: 'none' }} />

        {hasProgress ? (
          <div
            className="glass"
            style={{
              borderRadius: 24,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              flex: 'none',
            }}
          >
            <div style={{ font: "700 15px/1.3 'Manrope',sans-serif", color: 'var(--ink)' }}>
              Продолжить с уровня {progress!.currentLevel}
            </div>
            <button type="button" className="btn btn-primary" onClick={onContinue}>
              Продолжить
              <ArrowRightIcon />
            </button>
            <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={onRestart}>
              Начать заново
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Начать
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}
