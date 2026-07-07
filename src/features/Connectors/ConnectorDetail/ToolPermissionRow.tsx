import { Tooltip } from 'antd';
import { BanIcon, CheckIcon, HandIcon } from 'lucide-react';
import { memo } from 'react';

import { ConnectorToolPermission } from '@/database/schemas';
import type { ConnectorTool } from '@/store/tool/slices/connector';

import styles from './ToolPermissionRow.module.css';

interface ToolPermissionRowProps {
  onPermissionChange: (toolId: string, permission: ConnectorToolPermission) => void;
  tool: ConnectorTool;
}

const ToolPermissionRow = memo<ToolPermissionRowProps>(({ tool, onPermissionChange }) => {
  const btnClass = (permission: ConnectorToolPermission) =>
    tool.permission === permission ? `${styles.btn} ${styles.btnActive}` : styles.btn;

  return (
    <div className={styles.row}>
      <div className={styles.nameCell}>
        <div className={styles.toolName}>{tool.toolName}</div>
        {tool.description && (
          <Tooltip mouseEnterDelay={0.5} title={tool.description}>
            <div className={styles.description}>{tool.description}</div>
          </Tooltip>
        )}
      </div>
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <div
          className={btnClass(ConnectorToolPermission.auto)}
          title="Auto — AI calls directly"
          onClick={() => onPermissionChange(tool.id, ConnectorToolPermission.auto)}
        >
          <CheckIcon size={15} />
        </div>
        <div
          className={btnClass(ConnectorToolPermission.needs_approval)}
          title="Needs approval"
          onClick={() => onPermissionChange(tool.id, ConnectorToolPermission.needs_approval)}
        >
          <HandIcon size={15} />
        </div>
        <div
          className={btnClass(ConnectorToolPermission.disabled)}
          title="Disabled — hidden from AI"
          onClick={() => onPermissionChange(tool.id, ConnectorToolPermission.disabled)}
        >
          <BanIcon size={15} />
        </div>
      </div>
    </div>
  );
});

ToolPermissionRow.displayName = 'ToolPermissionRow';

export default ToolPermissionRow;
