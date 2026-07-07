'use client';

import { Avatar, Checkbox, Flexbox, Text } from '@lobehub/ui';
import { useHover } from 'ahooks';
import { X } from 'lucide-react';
import { memo, useRef } from 'react';

import { DEFAULT_AVATAR } from '@/const/meta';

import styles from './AgentItem.module.css';
import { useAgentSelectionStore } from './store';

export interface AgentItemData {
  avatar: string | null;
  backgroundColor: string | null;
  description: string | null;
  id: string;
  title: string | null;
}

interface AgentItemProps {
  agent: AgentItemData;
  defaultTitle: string;
  showCheckbox?: boolean;
  showRemove?: boolean;
}

const AgentItem = memo<AgentItemProps>(({ agent, defaultTitle, showCheckbox, showRemove }) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);

  const isSelected = useAgentSelectionStore((s) => s.selectedAgentIds.includes(agent.id));
  const toggleAgent = useAgentSelectionStore((s) => s.toggleAgent);
  const removeAgent = useAgentSelectionStore((s) => s.removeAgent);

  const title = agent.title || defaultTitle;
  const avatar = agent.avatar || DEFAULT_AVATAR;
  const avatarBackground = agent.backgroundColor ?? undefined;

  const handleClick = () => {
    toggleAgent(agent.id);
  };

  const handleRemove = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    removeAgent(agent.id);
  };

  return (
    <div
      className={styles.item}
      ref={ref}
      style={{ cursor: showCheckbox ? 'pointer' : 'default' }}
      onClick={showCheckbox ? handleClick : undefined}
    >
      <Flexbox horizontal align="center" gap={8} width="100%">
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onChange={handleClick}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          />
        )}
        <Avatar
          animation={isHovering}
          avatar={avatar}
          background={avatarBackground}
          shape="circle"
          size={28}
        />
        <Text ellipsis className={styles.title}>
          {title}
        </Text>
        {showRemove && (
          <div className={styles.removeButton} onClick={handleRemove}>
            <X size={14} />
          </div>
        )}
      </Flexbox>
    </div>
  );
});

export default AgentItem;
