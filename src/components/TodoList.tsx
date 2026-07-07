import { Center, Collapse, Flexbox, Icon, Text } from '@lobehub/ui';
import { CheckCircle, Circle, ListCheck } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './TodoList.module.css';

export interface TodoItem {
  assignee?: string;
  content: string;
  finished?: boolean;
}

export interface TodoListProps {
  /**
   * Optional function to resolve assignee ID to display name
   */
  resolveAssigneeName?: (assignee: string) => string | undefined;
  /**
   * List of todo items
   */
  todos: TodoItem[];
}

const TodoList = memo<TodoListProps>(({ todos, resolveAssigneeName }) => {
  const { t } = useTranslation('chat');

  const completedCount = todos.filter((todo) => todo.finished).length;
  const totalCount = todos.length;

  // Create the header with progress indicator
  const headerContent = (
    <Flexbox horizontal align="center" gap={8} style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Icon color={'var(--ant-color-text-tertiary)'} icon={ListCheck} size={16} style={{ flexShrink: 0 }} />
      <Text
        color={'var(--ant-color-text-tertiary)'}
        ellipsis={{ tooltip: true }}
        style={{ flex: 1 }}
        weight={400}
      >
        {completedCount} / {totalCount} {t('supervisor.todoList.title')}
      </Text>
    </Flexbox>
  );

  // Create todo items content
  const todoItems =
    todos.length === 0 ? (
      <Flexbox horizontal align="center" gap={8} padding="8px 0">
        <CheckCircle color={'var(--ant-color-success)'} size={16} />
        <span
          style={{
            color: 'var(--ant-color-text-secondary)',
            fontSize: 'var(--ant-font-size-sm)',
          }}
        >
          {t('supervisor.todoList.allComplete')}
        </span>
      </Flexbox>
    ) : (
      <Flexbox gap={0}>
        {todos.map((todo, index) => (
          <Flexbox
            horizontal
            align="center"
            gap={8}
            key={index}
            style={{
              borderBottom:
                index < todos.length - 1 ? `1px solid ${'var(--ant-color-border-secondary)'}` : 'none',
              padding: '8px 0',
              width: '100%',
            }}
          >
            <Center
              style={{
                color: todo.finished ? 'var(--ant-color-success)' : 'var(--ant-color-text-tertiary)',
                flexShrink: 0,
              }}
            >
              {todo.finished ? <CheckCircle size={16} /> : <Circle size={16} />}
            </Center>
            <span
              style={{
                color: todo.finished ? 'var(--ant-color-text-tertiary)' : 'var(--ant-color-text)',
                fontSize: 'var(--ant-font-size)',
                textDecoration: todo.finished ? 'line-through' : 'none',
              }}
            >
              {todo.content}
            </span>
            {todo.assignee && (
              <span
                style={{
                  color: 'var(--ant-color-text-tertiary)',
                  fontSize: 'var(--ant-font-size-sm)',
                  marginLeft: 6,
                }}
              >
                @{resolveAssigneeName?.(todo.assignee) ?? todo.assignee}
              </span>
            )}
          </Flexbox>
        ))}
      </Flexbox>
    );

  return (
    <Collapse
      className={styles.collapse}
      expandIconPlacement="end"
      size="small"
      variant="borderless"
      items={[
        {
          children: todoItems,
          key: 'todos',
          label: headerContent,
        },
      ]}
      styles={{
        header: {
          fontSize: 'var(--ant-font-size)',
        },
      }}
    />
  );
});

TodoList.displayName = 'TodoList';

export default TodoList;
