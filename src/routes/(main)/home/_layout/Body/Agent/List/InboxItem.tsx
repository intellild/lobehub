'use client';

import { DEFAULT_INBOX_AVATAR } from '@lobechat/const';
import { Avatar, Icon } from '@lobehub/ui';
import { Loader2 } from 'lucide-react';
import { type CSSProperties } from 'react';
import { memo } from 'react';

import NavItem from '@/features/NavPanel/components/NavItem';
import WorkspaceLink from '@/features/Workspace/WorkspaceLink';
import { usePrefetchAgent } from '@/hooks/usePrefetchAgent';
import { useAgentStore } from '@/store/agent';
import { agentSelectors, builtinAgentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { operationSelectors } from '@/store/chat/selectors';

import styles from './InboxItem.module.css';
import { usePreservedAgentUrl } from './usePreservedAgentUrl';

interface InboxItemProps {
  className?: string;
  style?: CSSProperties;
}

const InboxItem = memo<InboxItemProps>(({ className, style }) => {
  const inboxAgentId = useAgentStore(builtinAgentSelectors.inboxAgentId);
  const inboxMeta = useAgentStore(agentSelectors.getAgentMetaById(inboxAgentId!));

  const isLoading = useChatStore(
    inboxAgentId ? operationSelectors.isAgentVisiblyRunning(inboxAgentId) : () => false,
  );
  const prefetchAgent = usePrefetchAgent();
  const inboxAgentTitle = inboxMeta.title || 'Lobe AI';
  const inboxAgentAvatar = inboxMeta.avatar || DEFAULT_INBOX_AVATAR;
  const inboxUrl = usePreservedAgentUrl(inboxAgentId!);

  // Prefetch agent layout chunk and data eagerly since Lobe AI is almost always clicked
  prefetchAgent(inboxAgentId!);

  const avatarNode = (
    <Avatar emojiScaleWithBackground avatar={inboxAgentAvatar} shape={'square'} size={24} />
  );

  return (
    <WorkspaceLink aria-label={inboxAgentTitle} to={inboxUrl}>
      <NavItem
        className={className}
        style={style}
        title={inboxAgentTitle}
        icon={
          isLoading ? (
            <span className={styles.wrapper}>
              {avatarNode}
              <span className={styles.runningBadge}>
                <Icon spin icon={Loader2} size={9} />
              </span>
            </span>
          ) : (
            avatarNode
          )
        }
      />
    </WorkspaceLink>
  );
});

export default InboxItem;
