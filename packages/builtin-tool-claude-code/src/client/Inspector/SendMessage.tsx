'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { SendMessageArgs } from '../../types';
import styles from './SendMessage.module.css';

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

/**
 * Chip for the multi-agent `SendMessage` tool. Leads with the human-readable
 * `summary` (falling back to the message body) rather than the opaque agent id
 * from `to`/`recipient`, which means nothing to an end user.
 */
export const SendMessageInspector = memo<BuiltinInspectorProps<SendMessageArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t('builtins.lobe-claude-code.sendMessage.title');
    const source = args ?? partialArgs;
    const recap = (source?.summary ?? source?.message ?? source?.content)?.trim();

    const isShiny = isArgumentsStreaming || isLoading;

    if (isArgumentsStreaming && !recap) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    return (
      <div className={cx(inspectorTextStyles.root, isShiny && shinyTextStyles.shinyText)}>
        <span>{recap ? `${label}:` : label}</span>
        {recap && <span className={styles.chip}>{recap}</span>}
      </div>
    );
  },
);

SendMessageInspector.displayName = 'ClaudeCodeSendMessageInspector';
