import { AGENT_CHAT_URL } from '@lobechat/const';
import { AccordionItem, ActionIcon, Center, Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import {
  FolderClosedIcon,
  FolderOpenIcon,
  HandIcon,
  type LucideIcon,
  PlusIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { useActiveWorkspaceSlug } from '@/business/client/hooks/useActiveWorkspaceSlug';
import RingLoadingIcon from '@/components/RingLoading';
import { isDesktop } from '@/const/version';
import { useCommitWorkingDirectory } from '@/features/ChatInput/ControlBar/useCommitWorkingDirectory';
import { resolveExecutionTarget } from '@/helpers/executionTarget';
import { useQueryRoute } from '@/hooks/useQueryRoute';
import { usePathname } from '@/libs/router/navigation';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { operationSelectors } from '@/store/chat/selectors';

import { buildPrefixedAgentRoutePath, parseAgentPathname } from '../../../utils/agentPathname';
import TopicItem from '../../List/Item';
import { type GroupItemComponentProps } from '../GroupedAccordion';
import stylesModule from './GroupItem.module.css';
import {
  getProjectTopicStatusCounts,
  hasProjectTopicStatusCounts,
  type ProjectTopicStatusCounts,
} from './statusCounts';

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

const PROJECT_GROUP_PREFIX = 'project:';
const styles = stylesModule;

interface StatusBadgeConfig {
  className: string;
  count: number;
  icon?: LucideIcon;
  label: string;
  loading?: boolean;
}

const CollapsedStatusBadges = memo<{ counts: ProjectTopicStatusCounts }>(({ counts }) => {
  const { t } = useTranslation('topic');

  const items: StatusBadgeConfig[] = [
    {
      className: styles.statusBadgeLoading,
      count: counts.loading,
      label: t('projectStatus.loading', { count: counts.loading }),
      loading: true,
    },
    {
      className: styles.statusBadgeWaiting,
      count: counts.waitingForHuman,
      icon: HandIcon,
      label: t('projectStatus.waitingForHuman', { count: counts.waitingForHuman }),
    },
    {
      className: styles.statusBadgeError,
      count: counts.failed,
      icon: TriangleAlertIcon,
      label: t('projectStatus.failed', { count: counts.failed }),
    },
  ].filter((item) => item.count > 0);

  if (items.length === 0) return null;

  return (
    <Flexbox horizontal align={'center'} gap={3}>
      {items.map(({ className, count, icon, label, loading }) => (
        <Tooltip key={label} title={label}>
          <span aria-label={label} className={cx(styles.statusBadge, className)} role="status">
            {loading ? (
              <RingLoadingIcon
                ringColor={`color-mix(in srgb, ${'var(--ant-color-warning)'} 28%, transparent)`}
                size={11}
                style={{ color: 'var(--ant-color-warning)' }}
              />
            ) : (
              icon && <Icon icon={icon} size={{ size: 11, strokeWidth: 2 }} />
            )}
            {count}
          </span>
        </Tooltip>
      ))}
    </Flexbox>
  );
});

CollapsedStatusBadges.displayName = 'CollapsedProjectStatusBadges';

const CollapsedUnreadDot = memo<{ count: number }>(({ count }) => {
  const { t } = useTranslation('topic');
  const label = t('projectStatus.unread', { count });

  return (
    <Tooltip title={label}>
      <span aria-label={label} className={styles.unreadWrapper} role="status">
        <span className={styles.unreadRipple} />
        <span className={styles.unreadDot} />
      </span>
    </Tooltip>
  );
});

CollapsedUnreadDot.displayName = 'CollapsedProjectUnreadDot';

const GroupItem = memo<GroupItemComponentProps>(
  ({ group, activeTopicId, activeThreadId, expanded }) => {
    const { t } = useTranslation('topic');
    const { id, title, children } = group;

    const workingDirectory = useMemo(
      () =>
        id.startsWith(PROJECT_GROUP_PREFIX) ? id.slice(PROJECT_GROUP_PREFIX.length) : undefined,
      [id],
    );

    const agentId = useAgentStore((s) => s.activeAgentId);
    const { aid: routeAgentId } = useParams<{ aid?: string }>();
    const pathname = usePathname();
    const agentRoute = useMemo(() => parseAgentPathname(pathname), [pathname]);
    const targetAgentId = routeAgentId ?? agentRoute?.agentId ?? agentId;
    const currentAgentId = targetAgentId ?? agentId;
    const router = useQueryRoute();
    const activeWorkspaceSlug = useActiveWorkspaceSlug();
    const agencyConfig = useAgentStore(
      agentByIdSelectors.getAgencyConfigById(currentAgentId ?? ''),
    );
    const isHeterogeneous = useAgentStore((s) =>
      currentAgentId ? agentByIdSelectors.isAgentHeterogeneousById(currentAgentId)(s) : false,
    );
    const { commitAgentDefault } = useCommitWorkingDirectory(currentAgentId ?? '');

    const handleAddTopic = useCallback(async () => {
      if (!workingDirectory || !currentAgentId || !targetAgentId) return;
      // Write the agent's per-device default so the new topic inherits this
      // directory at creation time — the same high-precedence slot the picker
      // uses, not the legacy per-agent fallback that gets shadowed by it.
      await commitAgentDefault(workingDirectory);
      useChatStore.getState().switchTopic(null, { skipRefreshMessage: true });
      router.push(
        buildPrefixedAgentRoutePath(AGENT_CHAT_URL(targetAgentId), agentRoute, activeWorkspaceSlug),
      );
    }, [
      workingDirectory,
      currentAgentId,
      targetAgentId,
      commitAgentDefault,
      router,
      agentRoute,
      activeWorkspaceSlug,
    ]);

    // Web can add a topic in a directory too when the agent targets a bound
    // device — the write goes to `workingDirByDevice`, no Electron dependency.
    const effectiveTarget = resolveExecutionTarget(agencyConfig, {
      isHetero: isHeterogeneous,
      clientExecutionAvailable: isDesktop,
    });
    const isDeviceMode = effectiveTarget === 'device' && !!agencyConfig?.boundDeviceId;
    const canAddTopic = (isDesktop || isDeviceMode) && !!workingDirectory;

    const loadingTopicIds = useChatStore((s) => s.topicLoadingIds);
    const statusCounts = useMemo(
      () => getProjectTopicStatusCounts(children, new Set(loadingTopicIds)),
      [children, loadingTopicIds],
    );
    const childTopicIds = useMemo(() => children.map((topic) => topic.id), [children]);
    const unreadCount = useChatStore(
      operationSelectors.unreadCompletedCountForTopics(childTopicIds),
    );
    const hasCollapsedStatus = !expanded && hasProjectTopicStatusCounts(statusCounts);
    const hasCollapsedUnread = !expanded && unreadCount > 0;
    const hasCollapsedIndicators = hasCollapsedStatus || hasCollapsedUnread;
    const ProjectFolderIcon = expanded ? FolderOpenIcon : FolderClosedIcon;
    const action =
      canAddTopic || hasCollapsedIndicators ? (
        <Flexbox horizontal align={'center'} gap={4}>
          {hasCollapsedStatus && <CollapsedStatusBadges counts={statusCounts} />}
          {hasCollapsedUnread && <CollapsedUnreadDot count={unreadCount} />}
          {canAddTopic && (
            <span className={hasCollapsedIndicators ? styles.addTopicAction : undefined}>
              <ActionIcon
                icon={PlusIcon}
                size={'small'}
                title={t('actions.addNewTopicInProject', { directory: title })}
                tooltipProps={{ placement: 'right' }}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleAddTopic();
                }}
              />
            </span>
          )}
        </Flexbox>
      ) : undefined;

    return (
      <AccordionItem
        action={action}
        alwaysShowAction={hasCollapsedIndicators}
        itemKey={id}
        paddingBlock={4}
        paddingInline={4}
        title={
          <Flexbox horizontal align="center" gap={8} height={24} style={{ overflow: 'hidden' }}>
            <Center flex={'none'} height={24} width={28}>
              <Icon
                color={'var(--ant-color-text-tertiary)'}
                icon={ProjectFolderIcon}
                size={{ size: 15, strokeWidth: 1.5 }}
              />
            </Center>
            <Text ellipsis fontSize={14} style={{ color: 'var(--ant-color-text-secondary)', flex: 1 }}>
              {title}
            </Text>
          </Flexbox>
        }
      >
        <Flexbox gap={1} paddingBlock={1}>
          {children.map((topic) => (
            <TopicItem
              active={activeTopicId === topic.id}
              fav={topic.favorite}
              id={topic.id}
              key={topic.id}
              metadata={topic.metadata}
              status={topic.status}
              threadId={activeThreadId}
              title={topic.title}
            />
          ))}
        </Flexbox>
      </AccordionItem>
    );
  },
);

export default GroupItem;
