import { AccordionItem, Center, Flexbox, Icon, Text } from '@lobehub/ui';
import {
  Archive,
  CheckCircle2,
  CircleAlert,
  CircleDot,
  Loader,
  type LucideIcon,
  PauseCircle,
  Star,
} from 'lucide-react';
import { memo } from 'react';

import TopicItem from '../../List/Item';
import { type GroupItemComponentProps } from '../GroupedAccordion';

// Map each status-group id to its icon + color, mirroring the per-topic status
// glyphs in `List/Item`. `pending` collapses the attention-needing states
// (awaiting input / failed / unread completion) into one group; `favorite` is
// the synthetic group split out by `buildGroupedTopics`, so it gets a star.
const STATUS_ICON: Record<string, { color: string; icon: LucideIcon }> = {
  active: { color: 'var(--ant-color-text-tertiary)', icon: CircleDot },
  archived: { color: 'var(--ant-color-text-description)', icon: Archive },
  completed: { color: 'var(--ant-color-text-description)', icon: CheckCircle2 },
  favorite: { color: 'var(--ant-color-warning)', icon: Star },
  paused: { color: 'var(--ant-color-text-description)', icon: PauseCircle },
  pending: { color: 'var(--ant-color-warning)', icon: CircleAlert },
  running: { color: 'var(--ant-color-warning)', icon: Loader },
};

const GroupItem = memo<GroupItemComponentProps>(({ group, activeTopicId, activeThreadId }) => {
  const { id, title, children } = group;
  const statusIcon = STATUS_ICON[id];

  return (
    <AccordionItem
      itemKey={id}
      paddingBlock={4}
      paddingInline={'8px 4px'}
      title={
        <Flexbox horizontal align="center" gap={6} height={24} style={{ overflow: 'hidden' }}>
          {statusIcon && (
            <Center flex={'none'} height={16} width={16}>
              <Icon color={statusIcon.color} icon={statusIcon.icon} size={{ size: 13 }} />
            </Center>
          )}
          <Text ellipsis fontSize={12} style={{ flex: 1 }} type={'secondary'} weight={500}>
            {title}
          </Text>
        </Flexbox>
      }
    >
      <Flexbox gap={1} paddingBlock={1}>
        {children.map((topic) => (
          <TopicItem
            showWorkingDirectory
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
});

export default GroupItem;
