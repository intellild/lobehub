import { Tooltip } from '@lobehub/ui';
import { Bot } from 'lucide-react';
import { memo } from 'react';

import styles from './Fab.module.css';
import { useAgentMockStore } from './store/agentMockStore';

export const Fab = memo(() => {
  const popoverOpen = useAgentMockStore((s) => s.popoverOpen);
  const setPopoverOpen = useAgentMockStore((s) => s.setPopoverOpen);
  const modalOpen = useAgentMockStore((s) => s.modalOpen);
  const playback = useAgentMockStore((s) => s.playback);
  const playing = playback?.status === 'running';

  if (modalOpen) return null;

  return (
    <Tooltip title="Agent Mock (dev only)">
      <div
        className={`${styles.fab} ${popoverOpen ? styles.fabActive : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => setPopoverOpen(!popoverOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setPopoverOpen(!popoverOpen);
          }
        }}
      >
        <Bot size={18} />
        {playing && <span className={styles.ring} />}
      </div>
    </Tooltip>
  );
});

Fab.displayName = 'AgentMockFab';
