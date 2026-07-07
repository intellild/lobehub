'use client';

import type { GlobFilesState } from '@lobechat/tool-runtime';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '../../styles';
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

interface GlobFilesArgs {
  directory?: string;
  pattern?: string;
}

export const createGlobLocalFilesInspector = (translationKey: string) => {
  const Inspector = memo<BuiltinInspectorProps<GlobFilesArgs, GlobFilesState>>(
    ({ args, partialArgs, isArgumentsStreaming, pluginState, isLoading }) => {
      const { t } = useTranslation('plugin');

      const pattern = args?.pattern || partialArgs?.pattern || '';

      if (isArgumentsStreaming) {
        if (!pattern)
          return (
            <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
              <span>{t(translationKey as any)}</span>
            </div>
          );

        return (
          <div className={cx(inspectorTextStyles.root, styles.baseline, shinyTextStyles.shinyText)}>
            <span>{t(translationKey as any)}:</span>
            <span className={styles.tag}>{pattern}</span>
          </div>
        );
      }

      const hasFiles = (pluginState?.totalCount ?? 0) > 0;

      return (
        <div
          className={cx(
            inspectorTextStyles.root,
            styles.baseline,
            isLoading && shinyTextStyles.shinyText,
          )}
        >
          <span>{t(translationKey as any)}:</span>
          {pattern && <span className={styles.tag}>{pattern}</span>}
          {isLoading ? null : pluginState ? (
            hasFiles ? (
              <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
            ) : (
              <X className={styles.statusIcon} color={'var(--ant-color-error)'} size={14} />
            )
          ) : null}
        </div>
      );
    },
  );
  Inspector.displayName = 'GlobLocalFilesInspector';
  return Inspector;
};
