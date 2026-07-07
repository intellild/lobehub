'use client';

import { Flexbox, Popover } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { threadSelectors } from '@/store/chat/selectors';

import styles from './ThreadSwitcher.module.css';

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

interface ThreadSwitcherProps {
  title: string;
}

const ThreadSwitcher = memo<ThreadSwitcherProps>(({ title }) => {
  const { t } = useTranslation('chat');
  const activeThreadId = useChatStore((s) => s.activeThreadId);
  const threads = useChatStore(threadSelectors.currentTopicThreads);
  const switchThread = useChatStore((s) => s.switchThread);

  const handleSwitch = (id: string) => {
    if (id === activeThreadId) return;
    void switchThread(id);
  };

  const content = (
    <Flexbox
      gap={2}
      padding={4}
      style={{
        maxHeight: '50vh',
        maxWidth: 360,
        minWidth: 240,
        overflowY: 'auto',
      }}
    >
      {threads.map((thread) => (
        <div
          className={cx(styles.item, thread.id === activeThreadId && styles.itemActive)}
          key={thread.id}
          onClick={() => handleSwitch(thread.id)}
        >
          {thread.title || t('thread.title')}
        </div>
      ))}
    </Flexbox>
  );

  return (
    <Popover
      arrow={false}
      classNames={{ trigger: styles.trigger }}
      content={content}
      nativeButton={false}
      placement={'bottomLeft'}
      styles={{ content: { padding: 4 } }}
      trigger={'click'}
    >
      {title}
    </Popover>
  );
});

export default ThreadSwitcher;
