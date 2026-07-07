import { Flexbox } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import { useFileStore } from '@/store/file';
import { type FileChunk } from '@/types/chunk';

import styles from './ChunkItem.module.css';

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

type ChunkItemProps = FileChunk;

const ChunkItem = memo<ChunkItemProps>(({ text, type, id }) => {
  const highlightChunks = useFileStore((s) => s.highlightChunks);

  const typeClassName = useMemo(() => {
    switch (type) {
      default: {
        return styles.text;
      }
      case 'Title': {
        return styles.title;
      }
    }
  }, [type]);

  return (
    <Flexbox
      className={cx(styles.container, typeClassName)}
      onMouseEnter={() => {
        highlightChunks([id]);
      }}
      onMouseLeave={() => {
        highlightChunks([]);
      }}
    >
      {text}
    </Flexbox>
  );
});

export default ChunkItem;
