'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { type ClaudeCodeTodoItem, type TodoWriteArgs } from '../../types';
import styles from './TodoWrite.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

const RING_SIZE = 14;
const RING_STROKE = 2;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUM = 2 * Math.PI * RING_RADIUS;

interface TodoStats {
  completed: number;
  inProgress?: ClaudeCodeTodoItem;
  total: number;
}

interface ProgressRingProps {
  stats: TodoStats;
}

const ProgressRing = memo<ProgressRingProps>(({ stats }) => {
  const { completed, total } = stats;
  const ratio = total > 0 ? completed / total : 0;
  const allDone = total > 0 && completed === total;
  const color = allDone ? 'var(--ant-color-success)' : 'var(--ant-color-info)';

  return (
    <svg className={styles.ring} height={RING_SIZE} width={RING_SIZE}>
      <circle
        className={styles.ringTrack}
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        fill="none"
        r={RING_RADIUS}
        strokeWidth={RING_STROKE}
      />
      <circle
        className={styles.ringProgress}
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        fill="none"
        r={RING_RADIUS}
        stroke={color}
        strokeDasharray={RING_CIRCUM}
        strokeDashoffset={RING_CIRCUM * (1 - ratio)}
        strokeLinecap="round"
        strokeWidth={RING_STROKE}
      />
    </svg>
  );
});

ProgressRing.displayName = 'ClaudeCodeTodoProgressRing';

const computeStats = (args?: TodoWriteArgs): TodoStats => {
  const todos = args?.todos ?? [];
  return {
    completed: todos.filter((t) => t?.status === 'completed').length,
    inProgress: todos.find((t) => t?.status === 'in_progress'),
    total: todos.length,
  };
};

export const TodoWriteInspector = memo<BuiltinInspectorProps<TodoWriteArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');

    const stats = useMemo(() => computeStats(args || partialArgs), [args, partialArgs]);
    const allDone = stats.total > 0 && stats.completed === stats.total;

    const label = stats.inProgress
      ? t('builtins.lobe-claude-code.todoWrite.currentStep')
      : allDone
        ? t('builtins.lobe-claude-code.todoWrite.allDone')
        : t('builtins.lobe-claude-code.todoWrite.todos');

    const detail = stats.inProgress
      ? stats.inProgress.activeForm || stats.inProgress.content
      : stats.total > 0 && !allDone
        ? `${stats.completed}/${stats.total}`
        : undefined;

    if (isArgumentsStreaming && stats.total === 0) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        {stats.total > 0 && <ProgressRing stats={stats} />}
        <span>{label}</span>
        {detail && (
          <>
            <span>:</span>
            <span className={styles.chip}>{detail}</span>
          </>
        )}
      </div>
    );
  },
);

TodoWriteInspector.displayName = 'ClaudeCodeTodoWriteInspector';
