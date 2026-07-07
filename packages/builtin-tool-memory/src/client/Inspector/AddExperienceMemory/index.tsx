'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { AddExperienceMemoryParams, AddExperienceMemoryState } from '../../../types';
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

export const AddExperienceMemoryInspector = memo<
  BuiltinInspectorProps<AddExperienceMemoryParams, AddExperienceMemoryState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const title = args?.title || partialArgs?.title;

  // Initial streaming state
  if (isArgumentsStreaming && !title) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-user-memory.apiName.addExperienceMemory')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.memoryId;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-user-memory.apiName.addExperienceMemory')}</span>
      {title && (
        <>
          :<span className={highlightTextStyles.primary}>{title}</span>
        </>
      )}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </div>
  );
});

AddExperienceMemoryInspector.displayName = 'AddExperienceMemoryInspector';

export default AddExperienceMemoryInspector;
