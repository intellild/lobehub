import type { TaskStatus } from '@lobechat/types';
import { Icon, Text, Tooltip } from '@lobehub/ui';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import TaskStatusIcon from '../features/TaskStatusIcon';
import styles from './HiddenColumnsPanel.module.css';

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

export const HIDDEN_PANEL_WIDTH = {
  collapsed: 36,
  expanded: 220,
};

interface HiddenColumn {
  columnKey: string;
  label: string;
  statusIcon?: TaskStatus;
  total: number;
}

interface HiddenColumnsPanelProps {
  collapsed: boolean;
  columns: HiddenColumn[];
  onRestore: (columnKey: string) => void;
  onToggleCollapsed: (next: boolean) => void;
}

const HiddenColumnsPanel = memo<HiddenColumnsPanelProps>(
  ({ collapsed, columns, onRestore, onToggleCollapsed }) => {
    const { t } = useTranslation('chat');

    if (columns.length === 0) return null;

    const title = t('taskList.kanban.hiddenColumns');

    if (collapsed) {
      return (
        <div
          className={styles.panel}
          style={{ width: HIDDEN_PANEL_WIDTH.collapsed }}
          onClick={() => onToggleCollapsed(false)}
        >
          <Tooltip title={title}>
            <div className={styles.collapsedHeader}>
              <Icon icon={PanelRightOpen} size={16} />
              <Text className={styles.verticalLabel} type={'secondary'}>
                {title}
              </Text>
            </div>
          </Tooltip>
        </div>
      );
    }

    return (
      <div className={styles.panel} style={{ width: HIDDEN_PANEL_WIDTH.expanded }}>
        <div className={styles.header} onClick={() => onToggleCollapsed(true)}>
          <Text fontSize={13} weight={500}>
            {title}
          </Text>
          <Text className={styles.count} fontSize={12}>
            {columns.length}
          </Text>
          <Icon icon={PanelRightClose} size={16} />
        </div>
        <div className={styles.list}>
          {columns.map((column) => (
            <div
              className={cx(styles.card)}
              key={column.columnKey}
              title={t('taskList.kanban.showColumn')}
              onClick={() => onRestore(column.columnKey)}
            >
              {column.statusIcon && <TaskStatusIcon size={16} status={column.statusIcon} />}
              <Text fontSize={13}>{column.label}</Text>
              <Text className={styles.count} fontSize={12}>
                {column.total}
              </Text>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export default HiddenColumnsPanel;
