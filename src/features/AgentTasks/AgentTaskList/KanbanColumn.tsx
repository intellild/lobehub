import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { TaskStatus } from '@lobechat/types';
import { ActionIcon, type DropdownItem, DropdownMenu, Icon, Text } from '@lobehub/ui';
import { EyeOff, MoreHorizontal, Plus } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { TaskListItem } from '@/store/task/slices/list/initialState';

import type { TaskItemRouteScope } from '../features/AgentTaskItem';
import AgentTaskItem from '../features/AgentTaskItem';
import TaskStatusIcon from '../features/TaskStatusIcon';
import cardStyles from './KanbanColumn.module.css';
import TaskItemSkeleton from './TaskItemSkeleton';

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

export const COLUMN_WIDTH = 300;

const DraggableTaskCard = memo<{ routeScope?: TaskItemRouteScope; task: TaskListItem }>(
  ({ routeScope, task }) => {
    const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
      data: { task },
      id: task.identifier,
    });

    return (
      <div
        className={cx(cardStyles.card, isDragging && cardStyles.dragging)}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <AgentTaskItem routeScope={routeScope} task={task} variant="compact" />
      </div>
    );
  },
);
const styles = cardStyles;

export const COLUMN_I18N_KEYS: Record<string, string> = {
  backlog: 'taskList.kanban.backlog',
  canceled: 'taskList.kanban.canceled',
  done: 'taskList.kanban.done',
  needsInput: 'taskList.kanban.needsInput',
  running: 'taskList.kanban.running',
};

export const COLUMN_STATUS_ICON: Record<string, TaskStatus> = {
  backlog: 'backlog',
  canceled: 'canceled',
  done: 'completed',
  needsInput: 'paused',
  running: 'running',
};

interface KanbanColumnProps {
  columnKey: string;
  droppable: boolean;
  loading?: boolean;
  onCreate?: () => void;
  onHide?: () => void;
  routeScope?: TaskItemRouteScope;
  tasks: TaskListItem[];
  total: number;
}

const KanbanColumn = memo<KanbanColumnProps>(
  ({ columnKey, droppable, loading, onCreate, onHide, routeScope, tasks, total }) => {
    const { t } = useTranslation('chat');
    const { active } = useDndContext();
    const { isOver, setNodeRef } = useDroppable({
      disabled: !droppable,
      id: columnKey,
    });

    const statusIcon = COLUMN_STATUS_ICON[columnKey];
    const i18nKey = COLUMN_I18N_KEYS[columnKey];
    const label = i18nKey ? t(i18nKey as any) : columnKey;
    const isDragActive = !!active;

    // Don't highlight if dragging a card that's already in this column
    const activeTask = active?.data.current?.task as TaskListItem | undefined;
    const isFromThisColumn =
      activeTask && tasks.some((task) => task.identifier === activeTask.identifier);
    const showDropHighlight = isOver && droppable && !isFromThisColumn;
    const showDisabled = isDragActive && !droppable;

    const menuItems = useMemo<DropdownItem[]>(
      () =>
        onHide
          ? [
              {
                icon: <Icon icon={EyeOff} />,
                key: 'hide',
                label: t('taskList.kanban.hideColumn'),
                onClick: onHide,
              },
            ]
          : [],
      [onHide, t],
    );

    return (
      <div
        ref={setNodeRef}
        className={cx(
          styles.column,
          showDropHighlight && styles.dropActive,
          showDisabled && styles.notDroppable,
        )}
      >
        <div className={styles.header}>
          {statusIcon && <TaskStatusIcon size={18} status={statusIcon} />}
          <Text weight={500}>{label}</Text>
          {!loading && (
            <Text fontSize={12} type={'secondary'}>
              {total}
            </Text>
          )}
          <div className={cx(styles.headerActions, 'kanban-col-action')}>
            {menuItems.length > 0 && (
              <DropdownMenu items={menuItems}>
                <ActionIcon icon={MoreHorizontal} size={'small'} />
              </DropdownMenu>
            )}
            {onCreate && (
              <ActionIcon
                icon={Plus}
                size={'small'}
                title={t('taskList.kanban.addTask')}
                onClick={onCreate}
              />
            )}
          </div>
        </div>
        <div className={styles.body}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div className={cardStyles.card} key={`kanban-skeleton-${columnKey}-${index}`}>
                <TaskItemSkeleton variant={'compact'} />
              </div>
            ))
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <DraggableTaskCard key={task.identifier} routeScope={routeScope} task={task} />
            ))
          ) : onCreate ? (
            <div className={styles.addPill} title={t('taskList.kanban.addTask')} onClick={onCreate}>
              <Icon icon={Plus} size={16} />
            </div>
          ) : (
            <div className={styles.emptyText}>{t('taskList.kanban.emptyColumn')}</div>
          )}
        </div>
      </div>
    );
  },
);

export default KanbanColumn;
