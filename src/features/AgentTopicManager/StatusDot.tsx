'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import RingLoadingIcon from '@/components/RingLoading';
import { useTheme } from '@/hooks/useTheme';

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--ant-color-success)',
  archived: 'var(--ant-color-warning)',
  completed: 'var(--ant-color-text-quaternary)',
  failed: 'var(--ant-color-error)',
  idle: 'var(--ant-color-text-quaternary)',
  paused: 'var(--ant-color-info)',
  running: 'var(--ant-color-warning)',
  waitingForHuman: 'var(--ant-color-info)',
};

interface StatusDotProps {
  status: string | undefined;
}

const StatusDot = memo<StatusDotProps>(({ status: rawStatus }) => {
  const { t } = useTranslation('topic');
  const { isDarkMode } = useTheme();
  // No status (e.g. a topic that dropped out of the running set) reads as idle.
  const status = rawStatus || 'idle';
  const color = STATUS_COLOR[status] ?? 'var(--ant-color-text-quaternary)';
  const labelKey = `management.status.${status}` as const;

  // Match the sidebar Topic row: running shows the same spinning ring icon
  // (warning color) rather than a static dot, so users get a consistent
  // visual signal for "this topic is currently running".
  const isRunning = status === 'running';
  const ringColor = isDarkMode
    ? 'var(--ant-color-warning-border)'
    : `color-mix(in srgb, ${'var(--ant-color-warning)'} 45%, transparent)`;

  return (
    <Flexbox horizontal align={'center'} gap={6}>
      {isRunning ? (
        <RingLoadingIcon ringColor={ringColor} size={10} style={{ color: 'var(--ant-color-warning)' }} />
      ) : (
        <span
          style={{
            background: color,
            borderRadius: '50%',
            flexShrink: 0,
            height: 6,
            width: 6,
          }}
        />
      )}
      <span style={{ color: 'var(--ant-color-text-secondary)', fontSize: 11 }}>{t(labelKey as any)}</span>
    </Flexbox>
  );
});

StatusDot.displayName = 'AgentTopicManagerStatusDot';

export default StatusDot;
