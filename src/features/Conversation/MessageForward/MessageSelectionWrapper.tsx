'use client';

import { Flexbox } from '@lobehub/ui';
import { memo, type MouseEvent, type ReactNode, useCallback } from 'react';

import { CONVERSATION_MIN_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import { messageStateSelectors, useConversationStore } from '../store';
import styles from './MessageSelectionWrapper.module.css';
import { isSelectableRole } from './selectableRoles';
import SelectCircle from './SelectCircle';

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

interface MessageSelectionWrapperProps {
  children: ReactNode;
  id: string;
  role?: string;
}

/**
 * In multi-select mode, wraps a message with a full-bleed clickable band and a
 * round checkbox pinned to the band's leading edge. The band stretches to the
 * full stream width, while the inner lane keeps the content at the usual
 * reading-column width. Outside selection mode it renders the message untouched.
 */
const MessageSelectionWrapper = memo<MessageSelectionWrapperProps>(({ children, id, role }) => {
  const isSelectionMode = useConversationStore(messageStateSelectors.isSelectionMode);
  const isSelected = useConversationStore(messageStateSelectors.isMessageSelected(id));
  const toggleMessageSelected = useConversationStore((s) => s.toggleMessageSelected);
  const selectRange = useConversationStore((s) => s.selectRange);
  const wideScreen = useGlobalStore(systemStatusSelectors.wideScreen);

  const selectable = isSelectableRole(role);
  const isAssistant = role === 'assistant' || role === 'assistantGroup';

  const handleToggle = useCallback(
    (event: MouseEvent) => {
      if (!selectable) return;
      // Shift-click extends the selection from the anchor to this message.
      if (event.shiftKey) selectRange(id);
      else toggleMessageSelected(id);
    },
    [selectable, selectRange, toggleMessageSelected, id],
  );

  if (!isSelectionMode) return <>{children}</>;

  // Mirror WideScreenContainer's column width so selection content lines up with
  // the rest of the conversation.
  const laneWidth = wideScreen ? '100%' : `min(${CONVERSATION_MIN_WIDTH}px, 100%)`;

  const inner = (
    <>
      <div className={styles.checkbox}>{selectable && <SelectCircle checked={isSelected} />}</div>
      <Flexbox align={'center'} flex={1} style={{ minWidth: 0 }}>
        <Flexbox className={styles.lane} width={laneWidth}>
          <div
            className={cx(
              styles.content,
              isAssistant && styles.contentAssistant,
              isAssistant && styles.contentCollapsed,
            )}
          >
            {children}
          </div>
        </Flexbox>
      </Flexbox>
    </>
  );

  if (!selectable) {
    return (
      <Flexbox horizontal align={'center'} className={styles.disabledBand}>
        {inner}
      </Flexbox>
    );
  }

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.band, isSelected && styles.bandSelected)}
      onClick={handleToggle}
    >
      {inner}
    </Flexbox>
  );
});

MessageSelectionWrapper.displayName = 'MessageSelectionWrapper';

export default MessageSelectionWrapper;
