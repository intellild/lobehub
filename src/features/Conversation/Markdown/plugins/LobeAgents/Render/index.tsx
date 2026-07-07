'use client';

import { AGENT_CHAT_URL } from '@lobechat/const';
import { Avatar, Flexbox } from '@lobehub/ui';
import { ArrowRight } from 'lucide-react';
import { memo, useCallback } from 'react';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';

import { type MarkdownElementProps } from '../../type';
import styles from './index.module.css';

interface LobeAgentsProps extends MarkdownElementProps {
  avatar?: string;
  backgroundColor?: string;
  description?: string;
  identifier: string;
  title: string;
}

const Render = memo<LobeAgentsProps>(
  ({ identifier, title, description, avatar, backgroundColor }) => {
    const navigate = useWorkspaceAwareNavigate();

    const handleClick = useCallback(() => {
      if (!identifier) return;
      navigate(AGENT_CHAT_URL(identifier));
    }, [navigate, identifier]);

    if (!identifier) return null;

    return (
      <Flexbox horizontal align={'center'} className={styles.card} gap={12} onClick={handleClick}>
        <Avatar
          avatar={avatar || '🤖'}
          background={backgroundColor}
          shape={'square'}
          size={40}
          title={title || undefined}
        />
        <Flexbox className={styles.content} flex={1} gap={4}>
          <span className={styles.title}>{title || identifier}</span>
          {description && <span className={styles.description}>{description}</span>}
        </Flexbox>
        <ArrowRight className={styles.arrowIcon} size={16} />
      </Flexbox>
    );
  },
);

Render.displayName = 'LobeAgentsRender';

export default Render;
