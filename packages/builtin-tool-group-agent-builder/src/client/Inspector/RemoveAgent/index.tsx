'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { shinyTextStyles } from '@/styles';

import type { RemoveAgentParams, RemoveAgentState } from '../../../types';
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

export const RemoveAgentInspector = memo<
  BuiltinInspectorProps<RemoveAgentParams, RemoveAgentState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const agentId = args?.agentId || partialArgs?.agentId;
  const displayName = pluginState?.agentName || agentId;
  const avatar = pluginState?.agentAvatar;

  // Initial streaming state
  if (isArgumentsStreaming && !agentId) {
    return (
      <div className={cx(styles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.removeAgent')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.success;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText)}
      gap={8}
    >
      <span className={styles.title}>
        {t('builtins.lobe-group-agent-builder.apiName.removeAgent')}:
      </span>
      {avatar && (
        <Avatar avatar={avatar} shape={'square'} size={20} title={displayName || undefined} />
      )}
      {displayName && <span>{displayName}</span>}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </Flexbox>
  );
});

RemoveAgentInspector.displayName = 'RemoveAgentInspector';

export default RemoveAgentInspector;
