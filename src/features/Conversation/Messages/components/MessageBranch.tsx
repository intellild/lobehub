import { Center, Flexbox, Icon } from '@lobehub/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { useConversationStore } from '../../store';
import stylesModule from './MessageBranch.module.css';

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

const prefixCls = 'ant';
const styles = stylesModule;

interface MessageBranchProps {
  activeBranchIndex: number;
  count: number;
  messageId: string;
}

const MessageBranch = memo<MessageBranchProps>(({ activeBranchIndex, count, messageId }) => {
  const switchMessageBranch = useConversationStore((s) => s.switchMessageBranch);

  const handlePrevious = () => {
    if (activeBranchIndex > 0) {
      switchMessageBranch(messageId, activeBranchIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeBranchIndex < count - 1) {
      switchMessageBranch(messageId, activeBranchIndex + 1);
    }
  };

  const canGoPrevious = activeBranchIndex > 0;
  const canGoNext = activeBranchIndex < count - 1;

  return (
    <Flexbox horizontal className={styles.container}>
      <div
        className={cx(styles.button, !canGoPrevious && `${prefixCls}-disabled`)}
        role="button"
        tabIndex={canGoPrevious ? 0 : -1}
        onClick={handlePrevious}
      >
        <Icon icon={ChevronLeft} size={16} />
      </div>
      <Center className={styles.text}>
        {activeBranchIndex + 1}/{count}
      </Center>
      <div
        className={cx(styles.button, !canGoNext && `${prefixCls}-disabled`)}
        role="button"
        tabIndex={canGoNext ? 0 : -1}
        onClick={handleNext}
      >
        <Icon icon={ChevronRight} size={16} />
      </div>
    </Flexbox>
  );
});

export default MessageBranch;
