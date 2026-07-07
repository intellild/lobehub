'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ImportSkillParams, ImportSkillState } from '../../../types';
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

export const ImportSkillInspector = memo<
  BuiltinInspectorProps<ImportSkillParams, ImportSkillState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const url = args?.url || partialArgs?.url;
  const displayName = pluginState?.name || url;

  if (isArgumentsStreaming && !url) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-skill-store.apiName.importSkill')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.success;
  const hasResult = pluginState?.success !== undefined;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-skill-store.apiName.importSkill')}: </span>
      {displayName && <span className={highlightTextStyles.primary}>{displayName}</span>}
      {!isLoading &&
        hasResult &&
        (isSuccess ? (
          <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
        ) : (
          <X className={styles.statusIcon} color={'var(--ant-color-error)'} size={14} />
        ))}
    </div>
  );
});

ImportSkillInspector.displayName = 'ImportSkillInspector';
