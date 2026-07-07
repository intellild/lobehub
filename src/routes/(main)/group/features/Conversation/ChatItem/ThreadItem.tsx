import { Flexbox, Icon } from '@lobehub/ui';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { type ThreadItem } from '@/types/topic';

import styles from './ThreadItem.module.css';

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

const Item = memo<ThreadItem>(({ id, title, lastActiveAt, sourceMessageId }) => {
  const { t } = useTranslation('chat');
  const openThreadInPortal = useChatStore((s) => s.openThreadInPortal);
  const [isActive, messageCount] = useChatStore((s) => [
    s.activeThreadId === id,
    chatSelectors.countMessagesByThreadId(id)(s),
  ]);
  const mobile = useIsMobile();
  return (
    <Flexbox
      horizontal
      align={'baseline'}
      className={cx(styles.container, isActive && styles.active)}
      gap={8}
      onClick={() => {
        if (isActive) return;

        openThreadInPortal(id, sourceMessageId);
      }}
    >
      {title}
      <Flexbox horizontal className={styles.extra}>
        {!!messageCount && t('thread.threadMessageCount', { messageCount })}
        {!mobile && ` · ${dayjs(lastActiveAt).format('YYYY-MM-DD')}`}
        <Icon icon={ChevronRight} />
      </Flexbox>
    </Flexbox>
  );
});

export default Item;
