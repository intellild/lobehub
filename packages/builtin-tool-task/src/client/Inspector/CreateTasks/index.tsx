'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { CreateTasksParams, CreateTasksState } from '../../../types';
import styles from './index.module.css';

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

export const CreateTasksInspector = memo<
  BuiltinInspectorProps<CreateTasksParams, CreateTasksState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const tasks = args?.tasks || partialArgs?.tasks || [];
  const results = pluginState?.results || [];
  const count = results.length || tasks.length;
  const previewName = tasks[0]?.name || results[0]?.name;
  const remaining = count - 1;

  if (isArgumentsStreaming && count === 0) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-task.apiName.createTasks')}</span>
      </div>
    );
  }

  return (
    <div
      style={{ flexWrap: 'wrap', gap: 6 }}
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-task.apiName.createTasks')}</span>
      {count > 0 && (
        <span className={styles.countBadge}>
          {t('builtins.lobe-task.createTasks.count', { count })}
        </span>
      )}
      {previewName && (
        <>
          <span className={styles.separator}>·</span>
          <span className={styles.previewChip}>{previewName}</span>
          {remaining > 0 && (
            <span className={styles.moreBadge}>
              {t('builtins.lobe-task.createTasks.more', { count: remaining })}
            </span>
          )}
        </>
      )}
    </div>
  );
});

CreateTasksInspector.displayName = 'CreateTasksInspector';

export default CreateTasksInspector;
