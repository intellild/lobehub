'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Checkbox, Icon } from '@lobehub/ui';
import { CircleArrowRight, CircleCheckBig, CircleX, ListTodo, RotateCcw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ClaudeCodeApiName, type TaskUpdateArgs } from '../../../types';
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

interface TaskPluginStateItem {
  id?: string;
  status: 'todo' | 'processing' | 'completed';
  text: string;
}

interface TaskPluginState {
  todos?: {
    items?: TaskPluginStateItem[];
    updatedAt?: string;
  };
}

interface TaskRowProps {
  item: TaskPluginStateItem;
}

const TaskRow = memo<TaskRowProps>(({ item }) => {
  const { status, text } = item;

  if (status === 'processing') {
    return (
      <div className={cx(styles.itemRow, styles.processingRow)}>
        <Icon icon={CircleArrowRight} size={17} style={{ color: 'var(--ant-color-info)' }} />
        <span className={styles.textProcessing}>{text}</span>
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
      {text}
    </Checkbox>
  );
});

TaskRow.displayName = 'ClaudeCodeTaskRow';

/**
 * Per-call override that swaps the header into a status-flip readout
 * ("Completed: Read hosts") when the panel is rendered for a TaskUpdate.
 * Computed by the Task component from `apiName` + `args` so TaskHeader
 * stays a pure presentational component.
 *
 * `label` is the verb shown before `:`, `detail` is the subject; both
 * are pre-localized strings (no i18n inside TaskHeader for overrides).
 */
interface TaskHeaderOverride {
  color: string;
  detail?: string;
  icon: typeof CircleArrowRight;
  label: string;
}

interface TaskHeaderProps {
  completed: number;
  inProgress?: TaskPluginStateItem;
  override?: TaskHeaderOverride;
  total: number;
}

const TaskHeader = memo<TaskHeaderProps>(({ completed, total, inProgress, override }) => {
  const { t } = useTranslation('plugin');
  const allDone = total > 0 && completed === total;

  const icon =
    override?.icon ?? (inProgress ? CircleArrowRight : allDone ? CircleCheckBig : ListTodo);
  const color =
    override?.color ??
    (inProgress ? 'var(--ant-color-info)' : allDone ? 'var(--ant-color-success)' : 'var(--ant-color-text-secondary)');

  const label =
    override?.label ??
    (inProgress
      ? t('builtins.lobe-claude-code.todoWrite.currentStep')
      : allDone
        ? t('builtins.lobe-claude-code.todoWrite.allDone')
        : t('builtins.lobe-claude-code.todoWrite.todos'));
  const detail = override ? override.detail : inProgress?.text;

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

TaskHeader.displayName = 'ClaudeCodeTaskHeader';

/**
 * Panel render for CC 2.1.143+ task tools (TaskCreate / TaskUpdate / TaskList).
 *
 * Reads the **adapter-synthesized** `pluginState.todos.items` snapshot — the
 * same source consumed by `selectTodosFromMessages`. Each per-call args
 * carries only a delta, so the panel can't be built from args alone; the
 * accumulator's snapshot is the source of truth.
 *
 * Returns `null` when the snapshot is absent or empty (typical for a fresh
 * TaskList before any creates, or a TaskUpdate that failed).
 *
 * Header behaviour:
 *  - Default (TaskCreate / TaskList / TaskUpdate without status): shows the
 *    standard `currentStep / allDone / todos` aggregate label so the panel
 *    stays visually consistent with legacy TodoWrite sessions.
 *  - TaskUpdate with `args.status`: the per-call signal IS that status flip,
 *    so the header mirrors the chip ("Completed: Read hosts") instead of
 *    burying it under the aggregate. Subject is resolved from pluginState
 *    by id; `args.subject` is the resume-gap fallback.
 */
const Task = memo<BuiltinRenderProps<TaskUpdateArgs | undefined, TaskPluginState>>(
  ({ apiName, args, pluginState }) => {
    const items = pluginState?.todos?.items;
    const { t } = useTranslation('plugin');

    const stats = useMemo(() => {
      const list = items ?? [];
      return {
        completed: list.filter((item) => item.status === 'completed').length,
        inProgress: list.find((item) => item.status === 'processing'),
        total: list.length,
      };
    }, [items]);

    const override = useMemo<TaskHeaderOverride | undefined>(() => {
      if (apiName !== ClaudeCodeApiName.TaskUpdate) return undefined;
      const status = args?.status;
      const taskId = args?.taskId;
      const argsSubject = args?.subject;
      const resolvedSubject =
        argsSubject ?? (taskId ? items?.find((item) => item.id === taskId)?.text : undefined);
      if (status) {
        const map = {
          completed: {
            color: 'var(--ant-color-success)',
            icon: CircleCheckBig,
            label: t('builtins.lobe-claude-code.task.updateCompleted'),
          },
          deleted: {
            color: 'var(--ant-color-error)',
            icon: CircleX,
            label: t('builtins.lobe-claude-code.task.updateDeleted'),
          },
          in_progress: {
            color: 'var(--ant-color-info)',
            icon: CircleArrowRight,
            label: t('builtins.lobe-claude-code.task.updateInProgress'),
          },
          pending: {
            color: 'var(--ant-color-text-secondary)',
            icon: RotateCcw,
            label: t('builtins.lobe-claude-code.task.updatePending'),
          },
        } as const;
        const entry = map[status];
        return { ...entry, detail: resolvedSubject };
      }
      // Subject-only edit: surface the new subject as the header detail so a
      // collapsed panel still reads "Task updated: <subject>" instead of the
      // generic todo aggregate.
      if (argsSubject) {
        return {
          color: 'var(--ant-color-text-secondary)',
          detail: resolvedSubject,
          icon: ListTodo,
          label: t('builtins.lobe-claude-code.task.updateSubject.completed'),
        };
      }
      return undefined;
    }, [apiName, args, items, t]);

    if (!items || items.length === 0) return null;

    return (
      <Block variant={'outlined'} width="100%">
        <TaskHeader
          completed={stats.completed}
          inProgress={stats.inProgress}
          override={override}
          total={stats.total}
        />
        {items.map((item, index) => (
          <TaskRow item={item} key={index} />
        ))}
      </Block>
    );
  },
);

Task.displayName = 'ClaudeCodeTask';

export default Task;
