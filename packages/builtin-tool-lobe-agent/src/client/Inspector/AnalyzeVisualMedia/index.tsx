'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { AnalyzeVisualMediaParams, AnalyzeVisualMediaState } from '../../../types';

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

const getArrayLength = (value?: string[]) => (Array.isArray(value) ? value.length : 0);

export const AnalyzeVisualMediaInspector = memo<
  BuiltinInspectorProps<AnalyzeVisualMediaParams, AnalyzeVisualMediaState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const question = args?.question || partialArgs?.question;
  const mediaCount =
    pluginState?.files?.length ??
    getArrayLength(args?.refs || partialArgs?.refs) +
      getArrayLength(args?.urls || partialArgs?.urls);

  if (isArgumentsStreaming && !question) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-agent.apiName.analyzeVisualMedia')}</span>
      </div>
    );
  }

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      {question ? (
        <Trans
          components={{ question: <span className={highlightTextStyles.primary} /> }}
          i18nKey="builtins.lobe-agent.apiName.analyzeVisualMedia.result"
          ns="plugin"
          values={{ question }}
        />
      ) : (
        <span>{t('builtins.lobe-agent.apiName.analyzeVisualMedia')}</span>
      )}
      {!isArgumentsStreaming && !isLoading && mediaCount > 0 && (
        <Text
          as={'span'}
          color={'var(--ant-color-text-description)'}
          fontSize={12}
          style={{ marginInlineStart: 6 }}
        >
          · {t('builtins.lobe-agent.apiName.analyzeVisualMedia.mediaCount', { count: mediaCount })}
        </Text>
      )}
    </div>
  );
});

AnalyzeVisualMediaInspector.displayName = 'AnalyzeVisualMediaInspector';

export default AnalyzeVisualMediaInspector;
