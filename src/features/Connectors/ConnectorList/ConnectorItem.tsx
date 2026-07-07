
import { LinkIcon } from 'lucide-react';
import { memo } from 'react';

import type { ConnectorWithTools } from '@/store/tool/slices/connector';

import styles from './ConnectorItem.module.css';

interface ConnectorItemProps {
  active?: boolean;
  connector: ConnectorWithTools;
  onClick: () => void;
}

const ConnectorItem = memo<ConnectorItemProps>(({ connector, active, onClick }) => {
  const itemClass = active ? `${styles.item} ${styles.active}` : styles.item;

  return (
    <div className={itemClass} onClick={onClick}>
      <LinkIcon size={14} />
      <span style={{ flex: 1, fontSize: 14 }}>{connector.name}</span>
    </div>
  );
});

ConnectorItem.displayName = 'ConnectorItem';

export default ConnectorItem;
