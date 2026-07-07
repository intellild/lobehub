import { Checkbox, Flexbox, Icon, Tag } from '@lobehub/ui';
import { ChevronDown, ChevronUp, CircleArrowRight } from 'lucide-react';
import { type KeyboardEvent, memo, useCallback, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { selectCurrentTurnTodosFromMessages } from '@/store/chat/slices/message/selectors/dbMessage';
import { messageMapKey } from '@/store/chat/utils/messageMapKey';

import { useAgentContext } from '../../useAgentContext';
import styles from './index.module.css';
import { normalizeTaskProgress } from './taskProgressAdapter';

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

const ProgressSection = memo(() => {
  const { t } = useTranslation('chat');
  const [expanded, setExpanded] = useState(true);
  const context = useAgentContext();
  const chatKey = messageMapKey(context);
  const dbMessages = useChatStore((s) => s.dbMessagesMap[chatKey]);
  const listId = useId();

  const progress = useMemo(
    () => normalizeTaskProgress(selectCurrentTurnTodosFromMessages(dbMessages || [])),
    [dbMessages],
  );

  const items = progress.items;
  const total = items.length;
  const completed = items.filter((item) => item.status === 'completed').length;

  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);
  const handleHeaderKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleExpanded();
      }
    },
    [toggleExpanded],
  );

  if (total === 0) return null;

  const allDone = completed === total;
  const ringColor = allDone ? 'var(--ant-color-success)' : 'var(--ant-color-info)';
  const ringOffset = RING_CIRCUM * (1 - progress.completionPercent / 100);

  return (
    <div className={styles.container} data-testid="workspace-progress">
      <Flexbox
        horizontal
        align="center"
        aria-controls={listId}
        aria-expanded={expanded}
        className={styles.headerRow}
        gap={8}
        justify="space-between"
        role="button"
        tabIndex={0}
        onClick={toggleExpanded}
        onKeyDown={handleHeaderKeyDown}
      >
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
          <span className={styles.header}>{t('workingPanel.progress')}</span>
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

      <div
        className={cx(styles.listContainer, expanded ? styles.expanded : styles.collapsed)}
        id={listId}
      >
        <div className={styles.listInner}>
          {items.map((item, index) => {
            const isCompleted = item.status === 'completed';
            const isProcessing = item.status === 'processing';

            if (isProcessing) {
              return (
                <div className={cx(styles.itemRow, styles.processingRow)} key={item.id ?? index}>
                  <Icon
                    icon={CircleArrowRight}
                    size={17}
                    style={{ color: 'var(--ant-color-text-secondary)' }}
                  />
                  <span className={styles.textProcessing}>{item.text}</span>
                </div>
              );
            }

            return (
              <Checkbox
                backgroundColor={'var(--ant-color-success)'}
                checked={isCompleted}
                key={item.id ?? index}
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
    </div>
  );
});

ProgressSection.displayName = 'ProgressSection';

export default ProgressSection;
