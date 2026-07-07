import type { TaskStatus } from '@lobechat/types';
import { ActionIcon } from '@lobehub/ui';
import type { LucideIcon } from 'lucide-react';
import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  CircleX,
  Clock,
  HandIcon,
} from 'lucide-react';
import { memo } from 'react';

import { taskListSelectors } from '@/store/task/selectors';

interface StatusMeta {
  color: string;
  icon: LucideIcon;
}

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  backlog: { color: 'var(--ant-color-text-quaternary)', icon: CircleDashed },
  canceled: { color: 'var(--ant-color-text-secondary)', icon: CircleSlash },
  completed: { color: 'var(--ant-color-success)', icon: CircleCheck },
  failed: { color: 'var(--ant-color-error)', icon: CircleX },
  paused: { color: 'var(--ant-color-info)', icon: HandIcon },
  running: { color: 'var(--ant-color-warning)', icon: CircleDot },
  scheduled: { color: 'var(--ant-color-warning)', icon: Clock },
};

interface TaskStatusIconProps {
  size?: number;
  status: TaskStatus;
}

const TaskStatusIcon = memo<TaskStatusIconProps>(({ size = 16, status }) => {
  const displayStatus = taskListSelectors.getDisplayStatus(status);
  const meta = STATUS_META[status as TaskStatus] ?? STATUS_META.backlog;

  return (
    <ActionIcon
      color={meta.color}
      icon={meta.icon}
      title={displayStatus}
      size={{
        blockSize: size,
        size,
        borderRadius: '50%',
      }}
    />
  );
});

export default TaskStatusIcon;
