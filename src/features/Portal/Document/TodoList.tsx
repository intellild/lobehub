'use client';

import { AGENT_PLAN_FILE_TYPE } from '@lobechat/const';
import { Checkbox, Flexbox, Icon, Tag } from '@lobehub/ui';
import { ChevronDown, ChevronUp, ListTodo } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { chatPortalSelectors } from '@/store/chat/selectors';
import { useNotebookStore } from '@/store/notebook';
import { notebookSelectors } from '@/store/notebook/selectors';

import styles from './TodoList.module.css';

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

interface TodoItem {
  completed: boolean;
  text: string;
}

interface TodoState {
  items: TodoItem[];
  updatedAt: string;
}

const TodoList = memo(() => {
  const { t } = useTranslation('portal');
  const [expanded, setExpanded] = useState(false);

  const [topicId, documentId] = useChatStore((s) => [
    s.activeTopicId,
    chatPortalSelectors.portalDocumentId(s),
  ]);

  const document = useNotebookStore(notebookSelectors.getDocumentById(topicId, documentId));

  // Only show for agent/plan documents with todos in metadata
  if (!document || document.fileType !== AGENT_PLAN_FILE_TYPE) return null;

  const todos: TodoState | undefined = document.metadata?.todos;
  const items = todos?.items || [];

  if (items.length === 0) return null;

  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  // Find current pending task (first incomplete item)
  const currentPendingTask = items.find((item) => !item.completed);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className={styles.root}>
      <div className={styles.container} onClick={toggleExpanded}>
        {/* Header */}
        <Flexbox horizontal align="center" gap={8} justify="space-between">
          <Flexbox horizontal align="center" gap={8} style={{ flex: 1, minWidth: 0 }}>
            <Icon icon={ListTodo} size={16} style={{ color: 'var(--ant-color-primary)', flexShrink: 0 }} />
            <span className={styles.header}>
              {currentPendingTask?.text || t('document.todos.allCompleted')}
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

        {/* Progress Bar */}
        <Flexbox horizontal gap={8} style={{ marginTop: 8 }}>
          <div className={styles.progress}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </Flexbox>

        {/* Expandable Todo List */}
        <div className={cx(styles.listContainer, expanded ? styles.expanded : styles.collapsed)}>
          {items.map((item, index) => (
            <Checkbox
              backgroundColor={'var(--ant-color-success)'}
              checked={item.completed}
              key={index}
              shape="circle"
              style={{ borderWidth: 1.5, cursor: 'default', pointerEvents: 'none' }}
              classNames={{
                text: item.completed ? styles.textChecked : undefined,
                wrapper: styles.itemRow,
              }}
              textProps={{
                type: item.completed ? 'secondary' : undefined,
              }}
            >
              {item.text}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList;
