'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ClaudeCodeApiName, type TaskStopArgs } from '../../types';
import styles from './TaskStop.module.css';

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

/**
 * CC's tool for terminating a background task. Falls back to the legacy
 * `shell_id` field when `task_id` is absent — older CC builds emitted that.
 */
export const TaskStopInspector = memo<BuiltinInspectorProps<TaskStopArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t(ClaudeCodeApiName.TaskStop as any);
    const source = args ?? partialArgs;
    const taskId = (source?.task_id ?? source?.shell_id)?.trim();

    const isShiny = isArgumentsStreaming || isLoading;

    if (isArgumentsStreaming && !taskId) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    return (
      <div className={cx(inspectorTextStyles.root, isShiny && shinyTextStyles.shinyText)}>
        <span>{taskId ? `${label}:` : label}</span>
        {taskId && <span className={styles.chip}>{taskId}</span>}
      </div>
    );
  },
);

TaskStopInspector.displayName = 'ClaudeCodeTaskStopInspector';
