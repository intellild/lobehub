import { Center, Flexbox, Popover } from '@lobehub/ui';
import { ChevronsUpDownIcon } from 'lucide-react';
import { memo, Suspense, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { conversationSelectors, useConversationStore } from '@/features/Conversation';
import SkeletonList from '@/features/NavPanel/components/SkeletonList';
import { useFetchAgentList } from '@/hooks/useFetchAgentList';
import AgentAvatar from '@/routes/(main)/home/_layout/Body/Agent/List/AgentItem/Avatar';
import { AgentModalProvider } from '@/routes/(main)/home/_layout/Body/Agent/ModalProvider';
import { useAgentStore } from '@/store/agent';
import { useHomeStore } from '@/store/home';
import { homeAgentListSelectors } from '@/store/home/selectors';

import AgentItem from './AgentItem';
import styles from './AgentSelectorAction.module.css';

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

interface AgentSelectorActionProps {
  onAgentChange: (id: string) => void;
}

const AgentSelectorAction = memo<AgentSelectorActionProps>(({ onAgentChange }) => {
  const { t } = useTranslation(['chat', 'common']);
  const [open, setOpen] = useState(false);
  const agentId = useConversationStore(conversationSelectors.agentId);

  const agents = useHomeStore(homeAgentListSelectors.allAgents);
  const isAgentListInit = useHomeStore(homeAgentListSelectors.isAgentListInit);
  const pageAgentId = useAgentStore((s) => s.builtinAgentIdMap['page-agent']);
  const pageAgentData = useAgentStore((s) => s.agentMap[pageAgentId || '']);

  useFetchAgentList();

  const agentsWithBuiltin = useMemo(() => {
    // Page Copilot only supports selecting agent sessions, not group sessions.
    const availableAgents = agents.filter((agent) => agent.type === 'agent');
    const hasPageAgent = availableAgents.some((agent) => agent.id === pageAgentId);

    if (pageAgentId && !hasPageAgent) {
      return [
        {
          avatar: pageAgentData?.avatar || null,
          description: pageAgentData?.description || null,
          id: pageAgentId,
          pinned: false,
          title: t('builtinCopilot'),
          type: 'agent' as const,
          updatedAt: new Date(),
        },
        ...availableAgents,
      ];
    }

    return availableAgents;
  }, [agents, pageAgentId, pageAgentData, t]);

  const activeAgent = useMemo(
    () => agentsWithBuiltin.find((agent) => agent.id === agentId),
    [agentId, agentsWithBuiltin],
  );

  const handleAgentChange = useCallback(
    (id: string) => {
      onAgentChange(id);
    },
    [onAgentChange],
  );

  const renderAgents = (
    <Flexbox
      gap={4}
      padding={8}
      style={{
        maxHeight: '50vh',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      {agentsWithBuiltin.map((agent) => (
        <AgentItem
          active={agent.id === agentId}
          agentId={agent.id}
          agentTitle={agent.title || t('untitledAgent', { ns: 'chat' })}
          avatar={agent.avatar}
          key={agent.id}
          onAgentChange={handleAgentChange}
          onClose={() => setOpen(false)}
        />
      ))}
    </Flexbox>
  );

  return (
    <Popover
      open={open}
      placement="topLeft"
      trigger="click"
      content={
        <Suspense fallback={<SkeletonList rows={6} />}>
          <AgentModalProvider>
            {isAgentListInit ? renderAgents : <SkeletonList rows={6} />}
          </AgentModalProvider>
        </Suspense>
      }
      styles={{
        content: {
          padding: 0,
          width: 240,
        },
      }}
      onOpenChange={setOpen}
    >
      <Center horizontal className={cx(styles.container)} height={28} paddingInline={6}>
        <Flexbox horizontal align={'center'} gap={4}>
          <AgentAvatar
            avatar={typeof activeAgent?.avatar === 'string' ? activeAgent.avatar : undefined}
          />
          <ChevronsUpDownIcon className={styles.chevron} size={14} />
        </Flexbox>
      </Center>
    </Popover>
  );
});

AgentSelectorAction.displayName = 'AgentSelectorAction';

export default AgentSelectorAction;
