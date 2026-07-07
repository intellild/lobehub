import type { PlaybackState } from '@lobechat/agent-mock';
import { Flexbox } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import styles from './StatusPill.module.css';

interface StatusPillProps {
  playback: PlaybackState | null;
  speed: PlaybackState['speedMultiplier'];
}

export const StatusPill = memo<StatusPillProps>(({ playback, speed }) => {
  const tone = useMemo<'idle' | 'playing' | 'error'>(() => {
    if (!playback) return 'idle';
    if (playback.status === 'error') return 'error';
    if (playback.status === 'running' || playback.status === 'complete') return 'playing';
    return 'idle';
  }, [playback]);

  const dotClass =
    tone === 'error' ? styles.dotError : tone === 'playing' ? styles.dotPlaying : styles.dotIdle;

  const speedLabel = speed === 'instant' ? '∞' : `${speed}×`;

  return (
    <Flexbox horizontal align="center" className={styles.pill} gap={8}>
      <span className={`${styles.dot} ${dotClass}`} />
      {playback ? (
        <span>
          {playback.currentEventIndex}/{playback.totalEvents} · {speedLabel}
        </span>
      ) : (
        <span>idle · {speedLabel}</span>
      )}
    </Flexbox>
  );
});

StatusPill.displayName = 'AgentMockStatusPill';
