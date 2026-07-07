'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon } from '@lobehub/ui';
import { Play } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { RunTasksParams, RunTasksState } from '../../../types';
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

export const RunTasksInspector = memo<BuiltinInspectorProps<RunTasksParams, RunTasksState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
    const { t } = useTranslation('plugin');

    const identifiers = args?.identifiers || partialArgs?.identifiers || [];
    const results = pluginState?.results || [];
    const count = results.length || identifiers.length;
    const previewId = identifiers[0] || results[0]?.identifier;
    const remaining = count - 1;
    const failed = pluginState?.failed ?? 0;

    if (isArgumentsStreaming && count === 0) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <Icon icon={Play} size={12} style={{ color: 'var(--ant-color-warning)' }} />
          <span>{t('builtins.lobe-task.apiName.runTasks')}</span>
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
        <Icon icon={Play} size={12} style={{ color: 'var(--ant-color-warning)' }} />
        <span>{t('builtins.lobe-task.apiName.runTasks')}</span>
        {count > 0 && (
          <span className={styles.countBadge}>
            {t('builtins.lobe-task.runTasks.count', { count })}
          </span>
        )}
        {previewId && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.identifierChip}>{previewId}</span>
            {remaining > 0 && (
              <span className={styles.moreBadge}>
                {t('builtins.lobe-task.runTasks.more', { count: remaining })}
              </span>
            )}
          </>
        )}
        {failed > 0 && (
          <span className={styles.failedBadge}>
            {t('builtins.lobe-task.runTasks.failedCount', { count: failed })}
          </span>
        )}
      </div>
    );
  },
);

RunTasksInspector.displayName = 'RunTasksInspector';

export default RunTasksInspector;
