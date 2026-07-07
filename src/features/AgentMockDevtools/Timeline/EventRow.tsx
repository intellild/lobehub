import type { MockEvent } from '@lobechat/agent-mock';
import { memo } from 'react';

import styles from './EventRow.module.css';

type EventTone = 'info' | 'neutral' | 'muted' | 'error';

const TONE_BY_TYPE: Record<string, EventTone> = {
  error: 'error',
  step_complete: 'neutral',
  step_start: 'neutral',
  stream_chunk: 'neutral',
  stream_end: 'muted',
  stream_start: 'muted',
  tool_end: 'info',
  tool_execute: 'info',
  tool_start: 'info',
};

const toneVar: Record<EventTone, string> = {
  error: 'var(--ant-color-error)',
  info: 'var(--ant-color-text)',
  muted: 'var(--ant-color-text-quaternary)',
  neutral: 'var(--ant-color-text-tertiary)',
};

interface Props {
  cumulativeMs: number;
  event: MockEvent;
  index: number;
  isActive: boolean;
  onClick?: () => void;
}

const previewOf = (event: MockEvent): string => {
  const data =
    typeof event.data === 'object' && event.data !== null
      ? (event.data as Record<string, unknown>)
      : {};
  if (event.type === 'stream_chunk') {
    return String(data.content ?? data.reasoning ?? data.chunkType ?? '').slice(0, 100);
  }
  if (event.type === 'tool_start' || event.type === 'tool_end') {
    return JSON.stringify(data).slice(0, 100);
  }
  if (event.type === 'error') return String(data.message ?? '');
  return JSON.stringify(data).slice(0, 80);
};

export const EventRow = memo<Props>(({ event, index, cumulativeMs, isActive, onClick }) => {
  const tone = TONE_BY_TYPE[event.type] ?? 'neutral';

  return (
    <div className={`${styles.row} ${isActive ? styles.active : ''}`} onClick={onClick}>
      <span className={styles.type}>+{(cumulativeMs / 1000).toFixed(2)}s</span>
      <span className={styles.dot} style={{ background: toneVar[tone] }} />
      <span className={styles.type}>
        #{index} {event.type}
      </span>
      <span className={styles.preview}>{previewOf(event)}</span>
    </div>
  );
});

EventRow.displayName = 'AgentMockEventRow';
