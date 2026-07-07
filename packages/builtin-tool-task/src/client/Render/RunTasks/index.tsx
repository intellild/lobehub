'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Icon, Text } from '@lobehub/ui';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { RunTasksItemResult, RunTasksParams, RunTasksState } from '../../../types';
import styles from './index.module.css';

export const RunTasksRender = memo<BuiltinRenderProps<RunTasksParams, RunTasksState>>(
  ({ args, pluginState }) => {
    const { t } = useTranslation('plugin');

    const identifiers = args?.identifiers ?? [];
    const results = pluginState?.results ?? [];

    if (identifiers.length === 0 && results.length === 0) return null;

    const rows: { identifier: string; result?: RunTasksItemResult }[] =
      results.length > 0
        ? results.map((r) => ({ identifier: r.identifier, result: r }))
        : identifiers.map((identifier) => ({ identifier }));
    const failedCount = pluginState?.failed ?? results.filter((r) => !r.success).length;

    return (
      <Block variant={'outlined'} width={'100%'}>
        <div className={styles.header}>
          <span className={styles.headerCount}>
            {t('builtins.lobe-task.runTasks.count', { count: rows.length })}
          </span>
          {failedCount > 0 && (
            <span className={styles.failedBadge}>
              {t('builtins.lobe-task.runTasks.failedCount', { count: failedCount })}
            </span>
          )}
        </div>
        {rows.map((row, index) => {
          const { result } = row;
          const success = result?.success === true;
          const failedRow = result?.success === false;

          return (
            <div className={styles.taskItem} key={`${row.identifier}-${index}`}>
              <div className={styles.index}>{index + 1}.</div>
              <div className={styles.taskBody}>
                <div className={styles.row}>
                  <span className={styles.identifier}>{row.identifier}</span>
                  {success && (
                    <Icon icon={Check} size={14} style={{ color: 'var(--ant-color-success)' }} />
                  )}
                  {failedRow && <Icon icon={X} size={14} style={{ color: 'var(--ant-color-error)' }} />}
                </div>
                {result?.topicId && <span className={styles.meta}>topic {result.topicId}</span>}
                {failedRow && (
                  <Text as={'span'} fontSize={11} type={'danger'}>
                    {result?.error || 'Failed'}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </Block>
    );
  },
);

RunTasksRender.displayName = 'RunTasksRender';

export default RunTasksRender;
