'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { shinyTextStyles } from '@/styles';

import type { BatchCreateAgentsParams, BatchCreateAgentsState } from '../../../types';
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

export const BatchCreateAgentsInspector = memo<
  BuiltinInspectorProps<BatchCreateAgentsParams, BatchCreateAgentsState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const agents = args?.agents || partialArgs?.agents;

  // Get display info from agents
  const displayInfo = useMemo(() => {
    if (!agents || agents.length === 0) return null;

    const count = agents.length;
    const displayAgents = agents.slice(0, 3); // Show up to 3 avatars

    return { count, displayAgents };
  }, [agents]);

  // Initial streaming state
  if (isArgumentsStreaming && !displayInfo) {
    return (
      <div className={cx(styles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.batchCreateAgents')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.successCount === pluginState?.agents?.length;
  const successCount = pluginState?.successCount ?? 0;
  const totalCount = displayInfo?.count ?? 0;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText)}
      gap={8}
    >
      <span className={styles.title}>
        {t('builtins.lobe-group-agent-builder.apiName.batchCreateAgents')}:
      </span>
      {displayInfo && (
        <>
          <div className={styles.avatarGroup}>
            {displayInfo.displayAgents?.map((agent, index) => (
              <Avatar
                avatar={agent.avatar}
                key={index}
                shape={'square'}
                size={20}
                title={agent.title}
              />
            ))}
          </div>
          <span className={styles.count}>
            {pluginState
              ? `${successCount}/${totalCount}`
              : `${totalCount} ${t('builtins.lobe-group-agent-builder.inspector.agents')}`}
          </span>
        </>
      )}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </Flexbox>
  );
});

BatchCreateAgentsInspector.displayName = 'BatchCreateAgentsInspector';

export default BatchCreateAgentsInspector;
