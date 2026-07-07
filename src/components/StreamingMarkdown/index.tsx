'use client';

import { Markdown, ScrollArea } from '@lobehub/ui';
import type { RefObject } from 'react';
import { memo, useEffect } from 'react';

import { useAutoScroll } from '@/hooks/useAutoScroll';

import styles from './index.module.css';

interface StreamingMarkdownProps {
  children?: string;
  maxHeight?: number;
}

const StreamingMarkdown = memo<StreamingMarkdownProps>(({ children, maxHeight = 400 }) => {
  const { ref, handleScroll, resetScrollLock } = useAutoScroll<HTMLDivElement>({
    deps: [children],
  });

  // Reset scroll lock when content is cleared (new stream starts)
  useEffect(() => {
    if (!children) {
      resetScrollLock();
    }
  }, [children, resetScrollLock]);

  if (!children) return null;

  return (
    <ScrollArea
      disableContentFit
      scrollFade
      className={styles.scrollRoot}
      contentProps={{
        style: {
          color: 'inherit',
          display: 'block',
          fontSize: 'inherit',
          gap: 0,
          lineHeight: 'inherit',
        },
      }}
      viewportProps={{
        className: styles.container,
        ref: ref as RefObject<HTMLDivElement>,
        style: { maxHeight },
        onScroll: handleScroll,
      }}
    >
      <Markdown animated style={{ overflow: 'unset' }} variant={'chat'}>
        {children}
      </Markdown>
    </ScrollArea>
  );
});

StreamingMarkdown.displayName = 'StreamingMarkdown';

export default StreamingMarkdown;
