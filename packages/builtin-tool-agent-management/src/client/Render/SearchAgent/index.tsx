'use client';

import { DEFAULT_AVATAR } from '@lobechat/const';
import { HETEROGENEOUS_TYPE_LABELS } from '@lobechat/heterogeneous-agents';
import type { BuiltinRenderProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';

import type { AgentSearchItem, SearchAgentParams, SearchAgentState } from '../../../types';
import styles from './index.module.css';

export const SearchAgentRender = memo<BuiltinRenderProps<SearchAgentParams, SearchAgentState>>(
  ({ pluginState }) => {
    const { t } = useTranslation('plugin');
    const theme = useTheme();
    const agents = pluginState?.agents || [];

    if (agents.length === 0) {
      return (
        <div className={styles.noResults}>
          {t('builtins.lobe-agent-builder.inspector.noResults')}
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {agents.map((agent: AgentSearchItem) => (
          <Flexbox horizontal align={'center'} className={styles.agentItem} gap={12} key={agent.id}>
            <Avatar
              avatar={agent.avatar || DEFAULT_AVATAR}
              background={agent.backgroundColor || theme.colorBgContainer}
              shape={'square'}
              size={32}
              title={agent.title || undefined}
            />
            <Flexbox flex={1} gap={2}>
              <Flexbox horizontal align={'center'} gap={8}>
                <span className={styles.agentTitle}>{agent.title || agent.id}</span>
                {agent.heteroType && (
                  <span className={styles.heteroBadge}>
                    {HETEROGENEOUS_TYPE_LABELS[agent.heteroType] ?? agent.heteroType}
                  </span>
                )}
                {agent.isMarket && <span className={styles.marketBadge}>Market</span>}
              </Flexbox>
              {agent.description && <span className={styles.description}>{agent.description}</span>}
            </Flexbox>
          </Flexbox>
        ))}
      </div>
    );
  },
);

SearchAgentRender.displayName = 'SearchAgentRender';

export default SearchAgentRender;
