'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { UpdateGroupPromptParams, UpdateGroupPromptState } from '../../../types';
import stylesModule from './index.module.css';

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

const styles = stylesModule;

export const UpdateGroupPromptInspector = memo<
  BuiltinInspectorProps<UpdateGroupPromptParams, UpdateGroupPromptState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const prompt = args?.prompt || partialArgs?.prompt;

  // Calculate length difference
  const lengthDiff = useMemo(() => {
    if (!pluginState) return null;

    const newLength = pluginState.newPrompt?.length ?? 0;
    const prevLength = pluginState.previousPrompt?.length ?? 0;
    return newLength - prevLength;
  }, [pluginState]);

  // Initial streaming state
  if (isArgumentsStreaming && !prompt) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.updateGroupPrompt')}</span>
      </div>
    );
  }

  const streamingLength = prompt?.length ?? 0;

  return (
    <Flexbox
      horizontal
      align="center"
      className={cx(styles.root, (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText)}
      gap={6}
    >
      <span className={styles.label}>
        {t('builtins.lobe-group-agent-builder.apiName.updateGroupPrompt')}
      </span>
      {/* Show length diff when completed */}
      {!isLoading && !isArgumentsStreaming && lengthDiff !== null && (
        <Text
          code
          as="span"
          color={lengthDiff >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)'}
          fontSize={12}
        >
          {lengthDiff >= 0 ? '+' : ''}
          {lengthDiff}
          {t('builtins.lobe-agent-builder.inspector.chars')}
        </Text>
      )}
      {/* Show streaming length */}
      {(isArgumentsStreaming || isLoading) && streamingLength > 0 && (
        <Text code as="span" color={'var(--ant-color-text-description)'} fontSize={12}>
          ({streamingLength}
          {t('builtins.lobe-agent-builder.inspector.chars')})
        </Text>
      )}
    </Flexbox>
  );
});

UpdateGroupPromptInspector.displayName = 'UpdateGroupPromptInspector';

export default UpdateGroupPromptInspector;
