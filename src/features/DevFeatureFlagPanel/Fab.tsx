'use client';

import { Tooltip } from '@lobehub/ui';
import { FlagIcon } from 'lucide-react';
import { memo } from 'react';

import { useServerConfigStore } from '@/store/serverConfig';

import styles from './Fab.module.css';

interface FabProps {
  active: boolean;
  onToggle: () => void;
}

const Fab = memo<FabProps>(({ active, onToggle }) => {
  const overrideCount = useServerConfigStore((s) => Object.keys(s._featureFlagOverrides).length);

  return (
    <Tooltip placement={'left'} title={'Feature Flag Overrides (dev only)'}>
      <div
        className={`${styles.fab} ${active ? styles.fabActive : ''}`}
        role={'button'}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <FlagIcon size={18} />
        {overrideCount > 0 && <span className={styles.badge}>{overrideCount}</span>}
      </div>
    </Tooltip>
  );
});

Fab.displayName = 'DevFeatureFlagPanel/Fab';

export default Fab;
