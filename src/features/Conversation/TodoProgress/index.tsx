'use client';

import { type StepContextTodos } from '@lobechat/types';
import { Checkbox, Flexbox, Icon, Tag } from '@lobehub/ui';
import { ChevronDown, ChevronUp, CircleArrowRight } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { selectCurrentTurnTodosFromMessages } from '@/store/chat/slices/message/selectors/dbMessage';
import { shinyTextStyles } from '@/styles';

import { dataSelectors, messageStateSelectors, useConversationStore } from '../store';
import styles from './index.module.css';

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

const RING_SIZE = 14;
const RING_STROKE = 2;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUM = 2 * Math.PI * RING_RADIUS;

interface TodoProgressProps {
  className?: string;
  /**
   * When true, square the top corners — used when another panel (e.g.
   * QueueTray) sits flush above this one in the stack so the seams align.
   */
  topAttached?: boolean;
}

const TodoProgress = memo<TodoProgressProps>(({ className, topAttached }) => {
  const { t } = useTranslation('chat');
  const [expanded, setExpanded] = useState(false);

  // Get messages and AI generating state from conversation store
  const dbMessages = useConversationStore(dataSelectors.dbMessages);
  const isAIGenerating = useConversationStore(messageStateSelectors.isAIGenerating);

  // Extract todos produced within the current agent turn (after the last user
  // message). Older turns' todos intentionally drop out so a new operation
  // doesn't keep a stale completed progress bar on screen.
  const todos: StepContextTodos | undefined = useMemo(
    () => selectCurrentTurnTodosFromMessages(dbMessages),
    [dbMessages],
  );

  // Calculate progress
  const items = todos?.items || [];
  const total = items.length;
  const completed = items.filter((item) => item.status === 'completed').length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  // Find current pending task (first non-completed item, prioritize processing)
  const currentPendingTask =
    items.find((item) => item.status === 'processing') ||
    items.find((item) => item.status === 'todo');

  // Don't render if no todos
  if (total === 0) return null;

  const allDone = completed === total;
  const ringColor = allDone ? 'var(--ant-color-success)' : 'var(--ant-color-info)';
  const ringOffset = RING_CIRCUM * (1 - progressPercent / 100);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div
      className={cx(styles.container, topAttached && styles.containerTopAttached, className)}
      onClick={toggleExpanded}
    >
      {/* Header */}
      <Flexbox horizontal align="center" gap={8} justify="space-between">
        <Flexbox horizontal align="center" gap={8} style={{ flex: 1, minWidth: 0 }}>
          <svg className={styles.ring} height={RING_SIZE} width={RING_SIZE}>
            <circle
              className={styles.ringTrack}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              fill="none"
              r={RING_RADIUS}
              strokeWidth={RING_STROKE}
            />
            <circle
              className={styles.ringProgress}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              fill="none"
              r={RING_RADIUS}
              stroke={ringColor}
              strokeDasharray={RING_CIRCUM}
              strokeDashoffset={ringOffset}
              strokeLinecap="round"
              strokeWidth={RING_STROKE}
            />
          </svg>
          <span className={cx(styles.header, isAIGenerating && shinyTextStyles.shinyText)}>
            {currentPendingTask?.text ||
              t('todoProgress.allCompleted', { defaultValue: 'All tasks completed' })}
          </span>
          <Tag size="small" style={{ flexShrink: 0 }}>
            <span className={styles.count}>
              {completed}/{total}
            </span>
          </Tag>
        </Flexbox>
        <Icon
          icon={expanded ? ChevronUp : ChevronDown}
          size={16}
          style={{ color: 'var(--ant-color-text-tertiary)', flexShrink: 0 }}
        />
      </Flexbox>

      {/* Expandable Todo List */}
      <div className={cx(styles.listContainer, expanded ? styles.expanded : styles.collapsed)}>
        {items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isProcessing = item.status === 'processing';

          // Processing state uses CircleArrowRight icon
          if (isProcessing) {
            return (
              <div className={cx(styles.itemRow, styles.processingRow)} key={index}>
                <Icon
                  icon={CircleArrowRight}
                  size={17}
                  style={{ color: 'var(--ant-color-text-secondary)' }}
                />
                <span className={styles.textProcessing}>{item.text}</span>
              </div>
            );
          }

          // Todo and completed states use Checkbox
          return (
            <Checkbox
              backgroundColor={'var(--ant-color-success)'}
              checked={isCompleted}
              key={index}
              shape="circle"
              style={{ borderWidth: 1.5, cursor: 'default', pointerEvents: 'none' }}
              classNames={{
                text: cx(styles.textTodo, isCompleted && styles.textCompleted),
                wrapper: styles.itemRow,
              }}
              textProps={{
                type: isCompleted ? 'secondary' : undefined,
              }}
            >
              {item.text}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
});

TodoProgress.displayName = 'TodoProgress';

export default TodoProgress;
