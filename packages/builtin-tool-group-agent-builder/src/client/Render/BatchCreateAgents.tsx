'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { Users } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import ToolTag from '@/features/ToolTag';

import type { BatchCreateAgentsParams, BatchCreateAgentsState } from '../../types';
import styles from './BatchCreateAgents.module.css';

interface AgentItemProps {
  agent: {
    agentId: string;
    success: boolean;
    title: string;
  };
  definition?: {
    avatar?: string;
    description?: string;
    title: string;
    tools?: string[];
  };
}

const AgentItem = memo<AgentItemProps>(({ agent, definition }) => {
  const avatar = definition?.avatar;
  const description = definition?.description;
  const tools = definition?.tools;

  return (
    <Flexbox horizontal align="flex-start" className={styles.item} gap={12}>
      <Avatar
        avatar={avatar}
        size={24}
        style={{ flexShrink: 0, marginTop: 4 }}
        title={agent.title}
      />
      <Flexbox flex={1} gap={4} style={{ minWidth: 0, overflow: 'hidden' }}>
        <span className={styles.title}>{agent.title}</span>
        {description && <span className={styles.description}>{description}</span>}
        {tools && tools.length > 0 && (
          <Flexbox horizontal gap={4} style={{ marginTop: 8 }} wrap={'wrap'}>
            {tools.map((tool) => (
              <ToolTag identifier={tool} key={tool} variant={'compact'} />
            ))}
          </Flexbox>
        )}
      </Flexbox>
    </Flexbox>
  );
});

const BatchCreateAgentsRender = memo<
  BuiltinRenderProps<BatchCreateAgentsParams, BatchCreateAgentsState>
>(({ args, pluginState }) => {
  const { t } = useTranslation('plugin');
  const { agents: resultAgents } = pluginState || {};
  const definitions = args?.agents || [];

  if (!resultAgents || resultAgents.length === 0) {
    return (
      <Flexbox align="center" className={styles.empty} gap={8}>
        <Users size={24} />
        <span>{t('builtins.lobe-group-agent-builder.inspector.noResults')}</span>
      </Flexbox>
    );
  }

  return (
    <Flexbox className={styles.container}>
      {resultAgents.map((agent, index) => (
        <AgentItem agent={agent} definition={definitions[index]} key={agent.agentId || index} />
      ))}
    </Flexbox>
  );
});

export default BatchCreateAgentsRender;
