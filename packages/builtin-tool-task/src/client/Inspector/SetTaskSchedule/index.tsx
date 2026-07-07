'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { SetTaskScheduleParams, SetTaskScheduleState } from '../../../types';
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

export const SetTaskScheduleInspector = memo<
  BuiltinInspectorProps<SetTaskScheduleParams, SetTaskScheduleState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');

  const identifier = args?.identifier || partialArgs?.identifier;
  const automationMode = args?.automationMode ?? partialArgs?.automationMode;
  const modeLabel = automationMode === null ? 'off' : automationMode;

  return (
    <div
      style={{ flexWrap: 'wrap', gap: 4 }}
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-task.apiName.setTaskSchedule')}</span>
      {identifier && <span className={styles.identifierChip}>{identifier}</span>}
      {modeLabel && (
        <>
          <span className={styles.separator}>·</span>
          <span className={styles.modeChip}>{modeLabel}</span>
        </>
      )}
    </div>
  );
});

SetTaskScheduleInspector.displayName = 'SetTaskScheduleInspector';

export default SetTaskScheduleInspector;
