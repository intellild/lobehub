'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ClearTodosParams, ClearTodosState } from '../../../types';
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

export const ClearTodosInspector = memo<BuiltinInspectorProps<ClearTodosParams, ClearTodosState>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const mode = args?.mode || partialArgs?.mode;

    if (isArgumentsStreaming && !mode) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-agent.apiName.clearTodos')}</span>
        </div>
      );
    }

    const modeLabel =
      mode === 'all'
        ? t('builtins.lobe-agent.apiName.clearTodos.modeAll')
        : t('builtins.lobe-agent.apiName.clearTodos.modeCompleted');

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        <Trans
          components={{ mode: <span className={styles.mode} /> }}
          i18nKey="builtins.lobe-agent.apiName.clearTodos.result"
          ns="plugin"
          values={{ mode: modeLabel }}
        />
      </div>
    );
  },
);

ClearTodosInspector.displayName = 'ClearTodosInspector';

export default ClearTodosInspector;
