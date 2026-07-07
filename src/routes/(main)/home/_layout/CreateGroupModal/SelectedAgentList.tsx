'use client';

import { Flexbox, Input } from '@lobehub/ui';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AgentSelectionEmpty from '@/features/AgentSelectionEmpty';

import { type AgentItemData } from './AgentItem';
import AgentItem from './AgentItem';
import styles from './SelectedAgentList.module.css';
import { useAgentSelectionStore } from './store';

interface SelectedAgentListProps {
  agents: AgentItemData[];
  groupName: string;
  onGroupNameChange: (name: string) => void;
}

const SelectedAgentList = memo<SelectedAgentListProps>(
  ({ agents, groupName, onGroupNameChange }) => {
    const { t } = useTranslation(['chat', 'common']);

    const selectedAgentIds = useAgentSelectionStore((s) => s.selectedAgentIds);

    const defaultTitle = useMemo(() => t('defaultSession', { ns: 'common' }), [t]);

    // Get selected agents data
    const selectedAgents = useMemo(() => {
      return selectedAgentIds
        .map((id) => agents.find((a) => a.id === id))
        .filter((a): a is AgentItemData => a !== undefined);
    }, [agents, selectedAgentIds]);

    return (
      <Flexbox className={styles.container} gap={12}>
        <Flexbox gap={4}>
          <div className={styles.title}>{t('sessionGroup.groupName')}</div>
          <Input
            autoFocus
            placeholder={t('sessionGroup.inputPlaceholder')}
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
          />
        </Flexbox>

        <Flexbox flex={1} gap={4}>
          <div className={styles.title}>
            {t('sessionGroup.selectedAgents', { count: selectedAgents.length })}
          </div>
          {selectedAgents.length === 0 ? (
            <AgentSelectionEmpty variant="noSelected" />
          ) : (
            <Flexbox>
              {selectedAgents.map((agent) => (
                <AgentItem showRemove agent={agent} defaultTitle={defaultTitle} key={agent.id} />
              ))}
            </Flexbox>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default SelectedAgentList;
