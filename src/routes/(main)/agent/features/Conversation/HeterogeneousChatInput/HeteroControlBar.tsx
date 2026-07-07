'use client';

import { isDesktop } from '@lobechat/const';
import { Flexbox, Icon, Skeleton, Tooltip } from '@lobehub/ui';
import { CircleAlertIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import WorkspaceControls from '@/features/ChatInput/ControlBar/WorkspaceControls';
import { useAgentId } from '@/features/ChatInput/hooks/useAgentId';
import { resolveExecutionTarget } from '@/helpers/executionTarget';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';

import ClaudeCodeQuotaMenu from './ClaudeCodeQuotaMenu';
import CodexQuotaMenu from './CodexQuotaMenu';
import styles from './HeteroControlBar.module.css';

const HeteroControlBar = memo(() => {
  const { t: tChat } = useTranslation('chat');
  const agentId = useAgentId();

  // All hooks must be called unconditionally (Rules of Hooks)
  const isLoading = useAgentStore(agentByIdSelectors.isAgentConfigLoadingById(agentId));
  const agencyConfig = useAgentStore(agentByIdSelectors.getAgencyConfigById(agentId));

  // On web there's no full-access badge / skeleton — just the workspace controls
  // (the cloud repo switcher is rendered inside WorkspaceControls). The CLI
  // model + thinking-effort selector now lives in the input's bottom-left action
  // bar (see HeterogeneousChatInput), not in this strip.
  if (!isDesktop) {
    if (!agentId) return null;
    return (
      <Flexbox horizontal align={'center'} className={styles.bar}>
        <Flexbox horizontal align={'center'} className={styles.leftGroup} gap={4}>
          <WorkspaceControls alwaysShowWorkspace agentId={agentId} />
        </Flexbox>
      </Flexbox>
    );
  }

  if (!agentId || isLoading) {
    return (
      <Flexbox horizontal align={'center'} className={styles.bar} gap={4} justify={'space-between'}>
        <Skeleton.Button active size="small" style={{ height: 22, minWidth: 100, width: 100 }} />
        <Skeleton.Button active size="small" style={{ height: 22, minWidth: 80, width: 80 }} />
      </Flexbox>
    );
  }

  const fullAccessBadge = (
    <div className={styles.fullAccess}>
      <Icon icon={CircleAlertIcon} size={14} />
      <span className={styles.fullAccessLabel}>{tChat('heteroAgent.fullAccess.label')}</span>
    </div>
  );
  const heteroProvider = agencyConfig?.heterogeneousProvider;
  const isLocalHeteroExecution =
    resolveExecutionTarget(agencyConfig, {
      clientExecutionAvailable: isDesktop,
      isHetero: true,
    }) === 'local';
  const shouldShowCodexQuota = heteroProvider?.type === 'codex' && isLocalHeteroExecution;
  const shouldShowClaudeQuota = heteroProvider?.type === 'claude-code' && isLocalHeteroExecution;

  return (
    <Flexbox horizontal align={'center'} className={styles.bar} justify={'space-between'}>
      <Flexbox horizontal align={'center'} className={styles.leftGroup} gap={4}>
        <WorkspaceControls alwaysShowWorkspace agentId={agentId} />
      </Flexbox>
      <Flexbox horizontal align={'center'} className={styles.rightGroup} gap={4}>
        {shouldShowCodexQuota && (
          <CodexQuotaMenu command={heteroProvider?.command} env={heteroProvider?.env} />
        )}
        {shouldShowClaudeQuota && <ClaudeCodeQuotaMenu env={heteroProvider?.env} />}
        <Tooltip title={tChat('heteroAgent.fullAccess.tooltip')}>{fullAccessBadge}</Tooltip>
      </Flexbox>
    </Flexbox>
  );
});

HeteroControlBar.displayName = 'HeteroControlBar';

export default HeteroControlBar;
