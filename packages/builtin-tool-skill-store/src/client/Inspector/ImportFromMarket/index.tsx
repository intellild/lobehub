'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ImportFromMarketParams, ImportFromMarketState } from '../../../types';
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

export const ImportFromMarketInspector = memo<
  BuiltinInspectorProps<ImportFromMarketParams, ImportFromMarketState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const identifier = args?.identifier || partialArgs?.identifier;
  const displayName = pluginState?.name || identifier;

  if (isArgumentsStreaming && !identifier) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-skill-store.apiName.importFromMarket')}</span>
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
      <span>{t('builtins.lobe-skill-store.apiName.importFromMarket')}:</span>
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

ImportFromMarketInspector.displayName = 'ImportFromMarketInspector';
