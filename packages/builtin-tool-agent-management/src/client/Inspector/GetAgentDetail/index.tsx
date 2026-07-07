'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox, Tooltip } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, shinyTextStyles } from '@/styles';

import type { GetAgentDetailParams, GetAgentDetailState } from '../../../types';
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

export const GetAgentDetailInspector = memo<
  BuiltinInspectorProps<GetAgentDetailParams, GetAgentDetailState>
>(({ args, partialArgs, isArgumentsStreaming, pluginState }) => {
  const { t } = useTranslation('plugin');

  const agentId = args?.agentId || partialArgs?.agentId;
  // Once the result lands, show the resolved agent name instead of the opaque
  // `agt_xxx` id; keep the id reachable via tooltip.
  const meta = pluginState?.meta;
  const title = meta?.title;

  if (isArgumentsStreaming && !agentId) {
    return (
      <div className={cx(styles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-agent-management.apiName.getAgentDetail')}</span>
      </div>
    );
  }

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      gap={8}
    >
      <span className={styles.title}>
        {t('builtins.lobe-agent-management.inspector.getAgentDetail.title')}
      </span>
      {title ? (
        <Tooltip title={agentId}>
          <Flexbox horizontal align={'center'} gap={6}>
            {meta?.avatar && (
              <Avatar
                avatar={meta.avatar}
                background={meta.backgroundColor}
                shape={'square'}
                size={16}
              />
            )}
            <span className={highlightTextStyles.primary}>{title}</span>
          </Flexbox>
        </Tooltip>
      ) : (
        agentId && <span className={highlightTextStyles.primary}>{agentId}</span>
      )}
    </Flexbox>
  );
});

GetAgentDetailInspector.displayName = 'GetAgentDetailInspector';

export default GetAgentDetailInspector;
