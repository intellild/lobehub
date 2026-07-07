'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { UpdatePromptParams, UpdatePromptState } from '../../../types';
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

export const UpdatePromptInspector = memo<
  BuiltinInspectorProps<UpdatePromptParams, UpdatePromptState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const prompt = args?.prompt || partialArgs?.prompt;

  // Calculate length difference
  const lengthDiff = useMemo(() => {
    if (!pluginState) return null;

    const newLength = pluginState.newPrompt?.length ?? 0;
    const prevLength = pluginState.previousPrompt?.length ?? 0;
    const diff = newLength - prevLength;

    return diff;
  }, [pluginState]);

  // Initial streaming state
  if (isArgumentsStreaming && !prompt) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-agent-builder.apiName.updatePrompt')}</span>
      </div>
    );
  }

  // Calculate streaming length change
  const streamingLength = prompt?.length ?? 0;
  const isSuccess = pluginState?.success;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-agent-builder.apiName.updatePrompt')}</span>
      {/* Show length diff when completed */}
      {!isLoading && !isArgumentsStreaming && lengthDiff !== null && (
        <Text
          code
          as={'span'}
          color={lengthDiff >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)'}
          fontSize={12}
          style={{ marginInlineStart: 4 }}
        >
          ({lengthDiff >= 0 ? '+' : ''}
          {lengthDiff}
          {t('builtins.lobe-agent-builder.inspector.chars')})
        </Text>
      )}
      {/* Show streaming length */}
      {(isArgumentsStreaming || isLoading) && streamingLength > 0 && (
        <Text
          code
          as={'span'}
          color={'var(--ant-color-text-description)'}
          fontSize={12}
          style={{ marginInlineStart: 4 }}
        >
          ({streamingLength}
          {t('builtins.lobe-agent-builder.inspector.chars')})
        </Text>
      )}
      {!isLoading && !isArgumentsStreaming && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </div>
  );
});

UpdatePromptInspector.displayName = 'UpdatePromptInspector';

export default UpdatePromptInspector;
