import { Button, Flexbox } from '@lobehub/ui';
import { CornerDownLeft } from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';

import { useConversationStore } from '../../../../../store';
import styles from './ApprovalActions.module.css';
import { type ApprovalMode } from './index';

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

interface ApprovalActionsProps {
  apiName: string;
  approvalMode: ApprovalMode;
  assistantGroupId?: string;
  identifier: string;
  messageId: string;
  /**
   * Callback to be called before approve action
   * Used to flush pending saves (e.g., debounced saves) from intervention components
   */
  onBeforeApprove?: () => void | Promise<void>;
  toolCallId: string;
}

type Choice = 'approve' | 'approve-remember' | 'reject';

const ApprovalActions = memo<ApprovalActionsProps>(
  ({ approvalMode, apiName, assistantGroupId, identifier, messageId, onBeforeApprove }) => {
    const { t } = useTranslation('chat');
    const [choice, setChoice] = useState<Choice>('approve');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const rejectInputRef = useRef<HTMLInputElement>(null);

    const isMessageCreating = messageId.startsWith('tmp_');
    const isAllowListMode = approvalMode === 'allow-list';

    // Ordered choices drive both the numbered rows and the 1/2/3 shortcuts.
    // "Approve & don't ask again" is a first-class option (allow-list only)
    // rather than a checkbox nested under approve.
    const choices = useMemo<Choice[]>(
      () => (isAllowListMode ? ['approve', 'approve-remember', 'reject'] : ['approve', 'reject']),
      [isAllowListMode],
    );

    const [approveToolCall, rejectAndContinueToolCall] = useConversationStore((s) => [
      s.approveToolCall,
      s.rejectAndContinueToolCall,
    ]);
    const addToolToAllowList = useUserStore((s) => s.addToolToAllowList);

    const handleSubmit = useCallback(async () => {
      if (loading || isMessageCreating) return;
      setLoading(true);
      try {
        if (choice === 'reject') {
          await rejectAndContinueToolCall(messageId, reason.trim() || undefined);
        } else {
          if (onBeforeApprove) await onBeforeApprove();
          await approveToolCall(messageId, assistantGroupId ?? '');
          if (isAllowListMode && choice === 'approve-remember') {
            await addToolToAllowList(`${identifier}/${apiName}`);
          }
        }
      } finally {
        setLoading(false);
      }
    }, [
      addToolToAllowList,
      apiName,
      approveToolCall,
      assistantGroupId,
      choice,
      identifier,
      isAllowListMode,
      isMessageCreating,
      loading,
      messageId,
      onBeforeApprove,
      reason,
      rejectAndContinueToolCall,
    ]);

    // When choice flips to reject (via click on row, '2', or arrow), pull focus
    // into the inline input so the user can start typing the reason immediately.
    useEffect(() => {
      if (choice === 'reject') {
        rejectInputRef.current?.focus();
      }
    }, [choice]);

    // Window-level keyboard: 1/2/↑/↓ to switch, Enter to submit. Skip while
    // typing anywhere on the page so we never hijack the main chat composer.
    // The reject input has its own onKeyDown for Enter / ↑.
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (target) {
          const tag = target.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
        }
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        // Digit keys select the matching numbered row directly.
        if (/^[1-9]$/.test(e.key)) {
          const next = choices[Number(e.key) - 1];
          if (next) {
            e.preventDefault();
            setChoice(next);
          }
          return;
        }
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowDown': {
            e.preventDefault();
            setChoice((c) => {
              const idx = choices.indexOf(c);
              const delta = e.key === 'ArrowUp' ? -1 : 1;
              const nextIdx = (idx + delta + choices.length) % choices.length;
              return choices[nextIdx];
            });
            break;
          }
          case 'Enter': {
            if (e.shiftKey) return;
            e.preventDefault();
            void handleSubmit();
            break;
          }
          // No default
        }
      };
      window.addEventListener('keydown', handler);
      return () => {
        window.removeEventListener('keydown', handler);
      };
    }, [choices, handleSubmit]);

    const handleRejectInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSubmit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = choices.indexOf('reject');
        const prev = choices[idx - 1];
        if (prev) setChoice(prev);
        rejectInputRef.current?.blur();
      }
    };

    const rejectNumber = choices.indexOf('reject') + 1;

    const approveLabel: Record<'approve' | 'approve-remember', string> = {
      'approve': t('tool.intervention.optionApprove'),
      'approve-remember': t('tool.intervention.optionApproveRemember'),
    };

    return (
      <Flexbox className={styles.container}>
        <div className={styles.optionList} role="radiogroup">
          {choices.map((c, index) => {
            if (c === 'reject') {
              return (
                <div
                  aria-checked={choice === 'reject'}
                  className={cx(styles.option, choice === 'reject' && styles.optionSelected)}
                  key={c}
                  role="radio"
                  onClick={() => {
                    setChoice('reject');
                    rejectInputRef.current?.focus();
                  }}
                >
                  <span className={styles.number}>{rejectNumber}.</span>
                  <input
                    aria-label={t('tool.intervention.rejectReasonPlaceholder')}
                    className={styles.rejectInput}
                    disabled={loading || isMessageCreating}
                    placeholder={t('tool.intervention.rejectReasonPlaceholder')}
                    ref={rejectInputRef}
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={() => setChoice('reject')}
                    onKeyDown={handleRejectInputKeyDown}
                  />
                </div>
              );
            }

            return (
              <div
                aria-checked={choice === c}
                className={cx(styles.option, choice === c && styles.optionSelected)}
                key={c}
                role="radio"
                onClick={() => setChoice(c)}
              >
                <span className={styles.number}>{index + 1}.</span>
                <span className={styles.optionLabel}>{approveLabel[c]}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.submitButton}
            disabled={isMessageCreating}
            loading={loading}
            size={'middle'}
            type={'primary'}
            onClick={handleSubmit}
          >
            {t('tool.intervention.submit')}
            <span className={styles.shortcutHint}>
              <CornerDownLeft size={12} />
            </span>
          </Button>
        </div>
      </Flexbox>
    );
  },
);

export default ApprovalActions;
