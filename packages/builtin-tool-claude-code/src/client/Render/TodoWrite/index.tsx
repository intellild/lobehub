'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Checkbox, Icon } from '@lobehub/ui';
import { CircleArrowRight, CircleCheckBig, ListTodo } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ClaudeCodeTodoItem, TodoWriteArgs } from '../../../types';
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

interface TodoRowProps {
  item: ClaudeCodeTodoItem;
}

const TodoRow = memo<TodoRowProps>(({ item }) => {
  const { status, content, activeForm } = item;

  if (status === 'in_progress') {
    return (
      <div className={cx(styles.itemRow, styles.processingRow)}>
        <Icon icon={CircleArrowRight} size={17} style={{ color: 'var(--ant-color-info)' }} />
        <span className={styles.textProcessing}>{activeForm || content}</span>
      </div>
    );
  }

  const isCompleted = status === 'completed';

  return (
    <Checkbox
      backgroundColor={'var(--ant-color-success)'}
      checked={isCompleted}
      shape={'circle'}
      style={{ borderWidth: 1.5, cursor: 'default' }}
      classNames={{
        text: cx(styles.textPending, isCompleted && styles.textCompleted),
        wrapper: styles.itemRow,
      }}
      textProps={{
        type: isCompleted ? 'secondary' : undefined,
      }}
    >
      {content}
    </Checkbox>
  );
});

TodoRow.displayName = 'ClaudeCodeTodoRow';

interface TodoHeaderProps {
  completed: number;
  inProgress?: ClaudeCodeTodoItem;
  total: number;
}

const TodoHeader = memo<TodoHeaderProps>(({ completed, total, inProgress }) => {
  const { t } = useTranslation('plugin');
  const allDone = total > 0 && completed === total;

  const icon = inProgress ? CircleArrowRight : allDone ? CircleCheckBig : ListTodo;
  const color = inProgress
    ? 'var(--ant-color-info)'
    : allDone
      ? 'var(--ant-color-success)'
      : 'var(--ant-color-text-secondary)';

  const label = inProgress
    ? t('builtins.lobe-claude-code.todoWrite.currentStep')
    : allDone
      ? t('builtins.lobe-claude-code.todoWrite.allDone')
      : t('builtins.lobe-claude-code.todoWrite.todos');
  const detail = inProgress ? inProgress.activeForm || inProgress.content : undefined;

  return (
    <div className={styles.header}>
      <Icon icon={icon} size={16} style={{ color, flexShrink: 0 }} />
      <div className={styles.headerLabel}>
        <span>{label}</span>
        {detail && (
          <>
            <span>: </span>
            <span className={styles.headerDetail}>{detail}</span>
          </>
        )}
      </div>
      <span className={styles.headerCount}>
        {completed}/{total}
      </span>
    </div>
  );
});

TodoHeader.displayName = 'ClaudeCodeTodoHeader';

const TodoWrite = memo<BuiltinRenderProps<TodoWriteArgs>>(({ args }) => {
  const todos = args?.todos;

  const stats = useMemo(() => {
    const items = todos ?? [];
    return {
      completed: items.filter((t) => t?.status === 'completed').length,
      inProgress: items.find((t) => t?.status === 'in_progress'),
      total: items.length,
    };
  }, [todos]);

  if (!todos || todos.length === 0) return null;

  return (
    <Block variant={'outlined'} width="100%">
      <TodoHeader completed={stats.completed} inProgress={stats.inProgress} total={stats.total} />
      {todos.map((item, index) => (
        <TodoRow item={item} key={index} />
      ))}
    </Block>
  );
});

TodoWrite.displayName = 'ClaudeCodeTodoWrite';

export default TodoWrite;
