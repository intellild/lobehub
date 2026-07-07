'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Checkbox, Icon } from '@lobehub/ui';
import { CircleArrowRight } from 'lucide-react';
import { memo } from 'react';

import type { TodoItem, TodoList as TodoListType, TodoStatus } from '../../../types';
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

export interface TodoListRenderState {
  todos?: TodoListType;
}

interface ReadOnlyTodoItemProps {
  status: TodoStatus;
  text: string;
}

/**
 * Read-only todo item row, matching the style of TodoItemRow in SortableTodoList
 */
const ReadOnlyTodoItem = memo<ReadOnlyTodoItemProps>(({ text, status }) => {
  const isCompleted = status === 'completed';
  const isProcessing = status === 'processing';

  // Processing state uses CircleArrowRight icon
  if (isProcessing) {
    return (
      <div className={cx(styles.itemRow, styles.processingRow)}>
        <Icon icon={CircleArrowRight} size={17} style={{ color: 'var(--ant-color-text-secondary)' }} />
        <span className={styles.textProcessing}>{text}</span>
      </div>
    );
  }

  // Todo and completed states use Checkbox
  return (
    <Checkbox
      backgroundColor={'var(--ant-color-success)'}
      checked={isCompleted}
      shape={'circle'}
      style={{ borderWidth: 1.5, cursor: 'default' }}
      classNames={{
        text: cx(styles.textTodo, isCompleted && styles.textCompleted),
        wrapper: styles.itemRow,
      }}
      textProps={{
        type: isCompleted ? 'secondary' : undefined,
      }}
    >
      {text}
    </Checkbox>
  );
});

ReadOnlyTodoItem.displayName = 'ReadOnlyTodoItem';

interface TodoListUIProps {
  items: TodoItem[];
}

/**
 * Read-only TodoList UI component
 * Displays todo items in a style matching the editable SortableTodoList
 */
const TodoListUI = memo<TodoListUIProps>(({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    // Outer container with background - matches AddTodoIntervention
    <Block variant={'outlined'} width="100%">
      {items.map((item, index) => (
        <ReadOnlyTodoItem key={index} status={item.status} text={item.text} />
      ))}
    </Block>
  );
});

TodoListUI.displayName = 'TodoListUI';

/**
 * TodoList Render component for the lobe-agent tool
 * Read-only display of todo items matching the style of AddTodoIntervention
 */
const TodoListRender = memo<BuiltinRenderProps<unknown, TodoListRenderState>>(({ pluginState }) => {
  const todos = pluginState?.todos;
  const items: TodoItem[] = todos?.items || [];

  return <TodoListUI items={items} />;
});

TodoListRender.displayName = 'TodoListRender';

export default TodoListRender;
export { TodoListUI };
