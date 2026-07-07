'use client';

import { Flexbox } from '@lobehub/ui';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AgentSelectionEmpty from '@/features/AgentSelectionEmpty';

import { type AgentItemData } from './AgentItem';
import AgentItem from './AgentItem';
import styles from './SelectedAgentList.module.css';
import { useAgentSelectionStore } from './store';

interface SelectedAgentListProps {
  agents: AgentItemData[];
}

const SelectedAgentList = memo<SelectedAgentListProps>(({ agents }) => {
  const { t } = useTranslation(['chat', 'common']);

  const selectedAgentIds = useAgentSelectionStore((s) => s.selectedAgentIds);

  const defaultTitle = useMemo(() => t('defaultSession', { ns: 'common' }), [t]);

  // Get selected agents data
  const selectedAgents = useMemo(() => {
    return selectedAgentIds
      .map((id) => agents.find((a) => a.id === id))
      .filter((a): a is AgentItemData => a !== undefined);
  }, [agents, selectedAgentIds]);

  if (selectedAgents.length === 0) {
    return (
      <Flexbox className={styles.container} flex={1}>
        <AgentSelectionEmpty variant="noSelected" />
      </Flexbox>
    );
  }

  return (
    <Flexbox className={styles.container} gap={4}>
      <div className={styles.title}>
        {t('memberSelection.selectedAgents', { count: selectedAgents.length })}
      </div>
      <Flexbox>
        {selectedAgents.map((agent) => (
          <AgentItem showRemove agent={agent} defaultTitle={defaultTitle} key={agent.id} />
        ))}
      </Flexbox>
    </Flexbox>
  );
});

export default SelectedAgentList;
