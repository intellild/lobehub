'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';

import stylesModule from './SkeletonList.module.css';

const prefixCls = 'ant';
const styles = stylesModule;

interface SkeletonListProps {
  count?: number;
}

const SkeletonList = memo<SkeletonListProps>(({ count = 4 }) => {
  return (
    <Flexbox gap={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Flexbox horizontal align="center" className={styles.item} gap={12} key={index}>
          <Skeleton.Avatar
            active
            shape="square"
            size={40}
            style={{ borderRadius: 'var(--ant-border-radius)', flex: 'none' }}
          />
          <Flexbox flex={1} style={{ overflow: 'hidden' }}>
            <Skeleton
              active
              paragraph={{ className: styles.paragraph, rows: 1, width: '80%' }}
              title={{ className: styles.title, width: '60%' }}
            />
          </Flexbox>
        </Flexbox>
      ))}
    </Flexbox>
  );
});

export default SkeletonList;
