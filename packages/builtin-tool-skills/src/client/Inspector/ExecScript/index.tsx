'use client';

import { type BuiltinInspectorProps } from '@lobechat/types';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ExecScriptParams, ExecScriptState } from '../../../types';
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

export const ExecScriptInspector = memo<BuiltinInspectorProps<ExecScriptParams, ExecScriptState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
    const { t } = useTranslation('plugin');

    // Show description if available, otherwise show command
    const description = args?.description || partialArgs?.description || args?.command || '';

    if (isArgumentsStreaming) {
      if (!description)
        return (
          <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
            <span>{t('builtins.lobe-skills.apiName.execScript')}</span>
          </div>
        );

      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-skills.apiName.execScript')}: </span>
          <span className={highlightTextStyles.primary}>{description}</span>
        </div>
      );
    }

    const isSuccess = pluginState?.success;

    return (
      <div className={cx(inspectorTextStyles.root, isLoading && shinyTextStyles.shinyText)}>
        <span style={{ marginInlineStart: 2 }}>
          <span>{t('builtins.lobe-skills.apiName.execScript')}: </span>
          {description && <span className={highlightTextStyles.primary}>{description}</span>}
          {isLoading ? null : pluginState?.success !== undefined ? (
            isSuccess ? (
              <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
            ) : (
              <X className={styles.statusIcon} color={'var(--ant-color-error)'} size={14} />
            )
          ) : null}
        </span>
      </div>
    );
  },
);

ExecScriptInspector.displayName = 'ExecScriptInspector';
