'use client';

import type { EmojiReaction } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { usePermission } from '@/hooks/usePermission';

import styles from './ReactionDisplay.module.css';
import ReactionPicker from './ReactionPicker';

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

interface ReactionDisplayProps {
  /**
   * Whether the current user has reacted (used for single-user mode)
   */
  isActive?: (emoji: string) => boolean;
  /**
   * The message ID for adding reactions via the inline picker
   */
  messageId?: string;
  /**
   * Callback when a reaction is clicked
   */
  onReactionClick?: (emoji: string) => void;
  /**
   * The reactions to display
   */
  reactions: EmojiReaction[];
}

const ReactionDisplay = memo<ReactionDisplayProps>(
  ({ reactions, onReactionClick, messageId, isActive }) => {
    const { allowed: canEdit } = usePermission('edit_own_content');

    if (reactions.length === 0) return null;

    return (
      <Flexbox horizontal align={'center'} className={styles.container}>
        {reactions.map((reaction) => (
          <div
            className={cx(styles.reactionTag, isActive?.(reaction.emoji) && styles.active)}
            key={reaction.emoji}
            style={{ cursor: canEdit ? undefined : 'default' }}
            onClick={canEdit ? () => onReactionClick?.(reaction.emoji) : undefined}
          >
            <span>{reaction.emoji}</span>
            {reaction.count > 1 && <span className={styles.count}>{reaction.count}</span>}
          </div>
        ))}
        {canEdit && messageId && <ReactionPicker messageId={messageId} />}
      </Flexbox>
    );
  },
);

ReactionDisplay.displayName = 'ReactionDisplay';

export default ReactionDisplay;
