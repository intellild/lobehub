import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useAgentMockStore } from '../store/agentMockStore';
import styles from './StatsStrip.module.css';

const placeholder = '—';

export const StatsStrip = memo(() => {
  const playback = useAgentMockStore((s) => s.playback);
  const speed = useAgentMockStore((s) => s.speed);

  const stepValue = playback
    ? `${playback.currentStepIndex + 1} / ${playback.totalSteps}`
    : placeholder;
  const eventValue = playback
    ? `${playback.currentEventIndex} / ${playback.totalEvents}`
    : placeholder;
  const toolValue = playback ? `${playback.toolsExecuted} / ${playback.totalTools}` : placeholder;
  const elapsed = playback ? `${(playback.elapsedMs / 1000).toFixed(1)}s` : placeholder;
  const total = playback ? `${(playback.totalDurationMs / 1000).toFixed(1)}s` : placeholder;
  const speedLabel = speed === 'instant' ? '∞' : `${speed}×`;
  const status = playback?.status ?? 'idle';

  return (
    <Flexbox horizontal gap={12}>
      <div className={styles.card}>
        <div className={styles.label}>Step</div>
        <div className={`${styles.value} ${playback ? '' : styles.empty}`}>{stepValue}</div>
        <div className={styles.sub}>{status}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Event</div>
        <div className={`${styles.value} ${playback ? '' : styles.empty}`}>{eventValue}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Tools</div>
        <div className={`${styles.value} ${playback ? '' : styles.empty}`}>{toolValue}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Elapsed</div>
        <div className={`${styles.value} ${playback ? '' : styles.empty}`}>{elapsed}</div>
        <div className={styles.sub}>
          @ {speedLabel} · total {total}
        </div>
      </div>
    </Flexbox>
  );
});

StatsStrip.displayName = 'AgentMockStatsStrip';
