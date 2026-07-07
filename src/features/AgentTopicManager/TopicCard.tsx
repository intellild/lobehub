'use client';

import { AGENT_CHAT_TOPIC_URL } from '@lobechat/const';
import { formatPrice, formatTokenNumber } from '@lobechat/utils/format';
import { Block, Checkbox, Flexbox, Icon, Tag, Text } from '@lobehub/ui';
import { CircleDollarSign, FolderIcon, MessageSquare, Star, Zap } from 'lucide-react';
import { memo, type MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useActivityTime } from '@/hooks/useActivityTime';
import type { ChatTopic } from '@/types/topic';

import StatusDot from './StatusDot';
import { useTopicsViewStore } from './store';
import styles from './TopicCard.module.css';
import { getProjectLabel } from './utils';

interface TopicCardProps {
  agentId: string;
  topic: ChatTopic;
}

const TopicCard = memo<TopicCardProps>(({ topic, agentId }) => {
  const { t } = useTranslation('topic');
  const navigate = useNavigate();

  const selectMode = useTopicsViewStore((s) => s.selectMode);
  const selected = useTopicsViewStore((s) => s.selectedIds.includes(topic.id));
  const toggleSelected = useTopicsViewStore((s) => s.toggleSelected);
  const toggleSelectMode = useTopicsViewStore((s) => s.toggleSelectMode);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (selectMode || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        toggleSelected(topic.id);
        return;
      }
      navigate(AGENT_CHAT_TOPIC_URL(agentId, topic.id));
    },
    [selectMode, topic.id, agentId, toggleSelected, navigate],
  );

  const handleCheckboxChange = useCallback(() => {
    if (!selectMode) toggleSelectMode();
    toggleSelected(topic.id);
  }, [selectMode, topic.id, toggleSelected, toggleSelectMode]);

  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const projectLabel = getProjectLabel(topic);
  const status = topic.status ?? 'active';
  // Preview priority: user-written description → AI history summary → first user
  // message (sliced server-side when neither richer field exists).
  const preview =
    topic.description?.trim() || topic.historySummary?.trim() || topic.firstUserMessage?.trim();
  const updatedAt = useActivityTime(topic.updatedAt);
  // Postgres `numeric` / `int` round-trip through TRPC/JSON as strings in
  // some shapes, so coerce defensively before any `.toFixed` / format call.
  const messageCount = Number(topic.messageCount ?? 0);
  const tokenUsage = Number(topic.tokenUsage ?? 0);
  const cost = Number(topic.cost ?? 0);

  return (
    <Block
      className={[styles.card, selected && styles.cardSelected].filter(Boolean).join(' ')}
      gap={8}
      variant={'outlined'}
      onClick={handleClick}
    >
      <div className={styles.checkbox} onClick={stopPropagation}>
        <Checkbox
          checked={selected}
          classNames={{ checkbox: styles.checkboxBox }}
          size={18}
          onChange={handleCheckboxChange}
        />
      </div>

      <Flexbox horizontal align={'center'} gap={6}>
        {topic.favorite && (
          <Icon icon={Star} size={13} style={{ color: 'var(--ant-color-warning)', flexShrink: 0 }} />
        )}
        <Text className={styles.title} fontSize={14} weight={600}>
          {topic.title || t('defaultTitle')}
        </Text>
      </Flexbox>

      {preview && (
        <Text className={styles.description} fontSize={12} type={'secondary'}>
          {preview}
        </Text>
      )}

      {projectLabel && (
        <Tag bordered={false} icon={<Icon icon={FolderIcon} size={11} />} size={'small'}>
          {projectLabel}
        </Tag>
      )}

      <Flexbox horizontal align={'center'} className={styles.footer} justify={'space-between'}>
        <Flexbox
          horizontal
          align={'center'}
          gap={10}
          style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 11 }}
        >
          {messageCount > 0 && (
            <Flexbox horizontal align={'center'} gap={3}>
              <Icon icon={MessageSquare} size={11} />
              {messageCount}
            </Flexbox>
          )}
          {tokenUsage > 0 && (
            <Flexbox horizontal align={'center'} gap={3} title={`${tokenUsage} tokens`}>
              <Icon icon={Zap} size={11} />
              {formatTokenNumber(tokenUsage)}
            </Flexbox>
          )}
          {cost > 0 && (
            <Flexbox horizontal align={'center'} gap={3} title={`$${cost.toFixed(4)}`}>
              <Icon icon={CircleDollarSign} size={11} />
              {formatPrice(cost, 2)}
            </Flexbox>
          )}
          <span title={updatedAt.title}>{updatedAt.text}</span>
        </Flexbox>
        <StatusDot status={status} />
      </Flexbox>
    </Block>
  );
});

TopicCard.displayName = 'AgentTopicCard';

export default TopicCard;
