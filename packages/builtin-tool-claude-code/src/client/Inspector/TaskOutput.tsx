'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ClaudeCodeApiName, type TaskOutputArgs } from '../../types';
import styles from './TaskOutput.module.css';

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
 * CC's tool for reading output from a background task. The only user-relevant
 * arg is `task_id` — `block`/`timeout` are plumbing and live in the expanded
 * args view.
 */
export const TaskOutputInspector = memo<BuiltinInspectorProps<TaskOutputArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t(ClaudeCodeApiName.TaskOutput as any);
    const taskId = (args?.task_id ?? partialArgs?.task_id)?.trim();

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

TaskOutputInspector.displayName = 'ClaudeCodeTaskOutputInspector';
