import { Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';

import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';

import ContextWindow from '../ActionBar/Token';
import { useAgentId } from '../hooks/useAgentId';
import { useEffectiveAgentMode } from '../hooks/useEffectiveAgentMode';
import { useChatInputStore } from '../store';
import ApprovalMode from './ApprovalMode';
import styles from './index.module.css';
import ModeSelector from './ModeSelector';
import WorkspaceControls from './WorkspaceControls';

const ControlBar = memo(() => {
  const agentId = useAgentId();
  const showContextWindow = useChatInputStore((s) =>
    s.rightActions.flat().includes('contextWindow'),
  );

  const isLoading = useAgentStore((s) => agentByIdSelectors.isAgentConfigLoadingById(agentId)(s));
  const { isAgentRuntimeMode } = useEffectiveAgentMode(agentId);

  // Skeleton placeholder to prevent layout jump during loading
  if (!agentId || isLoading) {
    return (
      <Flexbox horizontal align={'center'} className={styles.bar} gap={4}>
        <Skeleton.Button active size="small" style={{ height: 22, minWidth: 64, width: 64 }} />
        <Skeleton.Button active size="small" style={{ height: 22, minWidth: 100, width: 100 }} />
      </Flexbox>
    );
  }

  return (
    <Flexbox horizontal align={'center'} className={styles.bar} justify={'space-between'}>
      {/* Left: chat-mode switcher + (agent-only) execution device + working directory */}
      <Flexbox horizontal align={'center'} className={styles.leftGroup} gap={4}>
        <ModeSelector />
        {isAgentRuntimeMode && <WorkspaceControls agentId={agentId} />}
      </Flexbox>

      <Flexbox horizontal align={'center'} className={styles.rightGroup} gap={4}>
        {isAgentRuntimeMode && <ApprovalMode />}
        {showContextWindow && <ContextWindow />}
      </Flexbox>
    </Flexbox>
  );
});

ControlBar.displayName = 'ControlBar';

export default ControlBar;
