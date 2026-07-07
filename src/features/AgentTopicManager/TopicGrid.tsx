'use client';

import type { GroupedTopic } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';

import TopicCard from './TopicCard';
import styles from './TopicGrid.module.css';
import type { GroupBy } from './types';
import { getProjectGroupTitle, getTimeGroupTitle } from './utils';

interface TopicGridProps {
  agentId: string;
  groupBy: GroupBy;
  groups: GroupedTopic[];
  showGroupTitles: boolean;
}

const TopicGrid = memo<TopicGridProps>(({ groups, agentId, showGroupTitles, groupBy }) => {
  const { t } = useTranslation('topic');

  return (
    <Flexbox gap={12}>
      {groups.map((group) => {
        if (group.children.length === 0) return null;
        const title =
          groupBy === 'byProject'
            ? getProjectGroupTitle(group.id, group.title, t)
            : group.title || getTimeGroupTitle(group.id, t);
        return (
          <Fragment key={group.id}>
            {showGroupTitles && (
              <Text as={'div'} className={styles.groupTitle}>
                {title}
              </Text>
            )}
            <div className={styles.grid}>
              {group.children.map((topic) => (
                <TopicCard agentId={agentId} key={topic.id} topic={topic} />
              ))}
            </div>
          </Fragment>
        );
      })}
    </Flexbox>
  );
});

TopicGrid.displayName = 'AgentTopicManagerGrid';

export default TopicGrid;
