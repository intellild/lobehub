'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { DeleteTaskParams, DeleteTaskState } from '../../../types';
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

export const DeleteTaskInspector = memo<BuiltinInspectorProps<DeleteTaskParams, DeleteTaskState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');

    const identifier = args?.identifier || partialArgs?.identifier;

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span style={{ color: 'var(--ant-color-error)' }}>
          {t('builtins.lobe-task.apiName.deleteTask')}
        </span>
        {identifier && <span className={styles.identifierChip}>{identifier}</span>}
      </div>
    );
  },
);

DeleteTaskInspector.displayName = 'DeleteTaskInspector';

export default DeleteTaskInspector;
