import { Flexbox, Tag } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import { type SemanticSearchChunk } from '@/types/chunk';

import styles from './Item.module.css';

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

interface ChunkItemProps extends Omit<SemanticSearchChunk, 'index'> {
  index: number;
}

const SearchItem = memo<ChunkItemProps>(({ text, pageNumber, type, similarity }) => {
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
    <Flexbox className={cx(styles.container, typeClassName)} gap={8}>
      {text}

      <Flexbox horizontal align={'center'} distribution={'space-between'}>
        <Tag variant={'filled'}>{similarity.toFixed(2)}</Tag>
        <Flexbox className={styles.pageNumber}>第 {pageNumber} 页</Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default SearchItem;
