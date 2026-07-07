'use client';

import type { ReplaceTextArgs } from '@lobechat/editor-runtime';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon, Text } from '@lobehub/ui';
import { ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ReplaceTextState } from '../../../types';
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

export const ReplaceTextInspector = memo<BuiltinInspectorProps<ReplaceTextArgs, ReplaceTextState>>(
  ({ args, partialArgs, isArgumentsStreaming, pluginState }) => {
    const { t } = useTranslation('plugin');

    const from = args?.searchText || partialArgs?.searchText;
    const to = args?.newText ?? partialArgs?.newText;

    // During streaming without searchText yet, show init message
    if (isArgumentsStreaming && !from) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-page-agent.apiName.replaceText.init')}</span>
        </div>
      );
    }

    const count = pluginState?.replacementCount ?? 0;
    const hasResult = from && to !== undefined;

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        <span className={styles.title}>{t('builtins.lobe-page-agent.apiName.replaceText')}</span>
        {hasResult && (
          <>
            <span className={styles.from}>{from}</span>
            <Icon className={styles.arrow} icon={ArrowRight} size={12} />
            <span className={highlightTextStyles.gold}>
              {to || t('builtins.lobe-page-agent.apiName.replaceText.empty')}
            </span>
            {count > 0 && (
              <Text code as={'span'} fontSize={12} type={'secondary'}>
                {' '}
                ({t('builtins.lobe-page-agent.apiName.replaceText.count', { count })})
              </Text>
            )}
          </>
        )}
      </div>
    );
  },
);

ReplaceTextInspector.displayName = 'ReplaceTextInspector';

export default ReplaceTextInspector;
