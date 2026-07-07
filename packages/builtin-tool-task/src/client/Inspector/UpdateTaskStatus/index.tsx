'use client';

import type { BuiltinInspectorProps, TaskStatus } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { UpdateTaskStatusParams, UpdateTaskStatusState } from '../../../types';
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

const STATUS_TONE: Partial<Record<TaskStatus, { bg: string; fg: string }>> = {
  backlog: { bg: 'var(--ant-color-fill-tertiary)', fg: 'var(--ant-color-text-secondary)' },
  canceled: { bg: 'var(--ant-color-fill-tertiary)', fg: 'var(--ant-color-text-secondary)' },
  completed: { bg: 'var(--ant-color-success-bg)', fg: 'var(--ant-color-success)' },
  failed: { bg: 'var(--ant-color-error-bg)', fg: 'var(--ant-color-error)' },
  paused: { bg: 'var(--ant-color-fill-tertiary)', fg: 'var(--ant-color-text-secondary)' },
  running: { bg: 'var(--ant-color-warning-bg)', fg: 'var(--ant-color-warning)' },
  scheduled: { bg: 'var(--ant-color-info-bg)', fg: 'var(--ant-color-info)' },
};

export const UpdateTaskStatusInspector = memo<
  BuiltinInspectorProps<UpdateTaskStatusParams, UpdateTaskStatusState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');

  const identifier = args?.identifier || partialArgs?.identifier;
  const status = (args?.status || partialArgs?.status) as TaskStatus | undefined;
  const tone = status ? STATUS_TONE[status] : undefined;

  return (
    <div
      style={{ flexWrap: 'wrap', gap: 4 }}
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-task.apiName.updateTaskStatus')}</span>
      {identifier && <span className={styles.identifierChip}>{identifier}</span>}
      {status && (
        <>
          <span className={styles.separator}>·</span>
          <span
            className={styles.statusChip}
            style={{
              background: tone?.bg ?? 'var(--ant-color-fill-tertiary)',
              color: tone?.fg ?? 'var(--ant-color-text-secondary)',
            }}
          >
            {status}
          </span>
        </>
      )}
    </div>
  );
});

UpdateTaskStatusInspector.displayName = 'UpdateTaskStatusInspector';

export default UpdateTaskStatusInspector;
