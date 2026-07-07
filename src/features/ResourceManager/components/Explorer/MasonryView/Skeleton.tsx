
import { memo } from 'react';

import stylesModule from './Skeleton.module.css';

const styles = stylesModule;

interface MasonrySkeletonProps {
  columnCount: number;
}

const MasonryViewSkeleton = memo<MasonrySkeletonProps>(({ columnCount }) => {
  // Generate varying heights for more natural masonry look
  const heights = [180, 220, 200, 190, 240, 210, 200, 230, 180, 220, 210, 190];

  // Calculate number of items based on viewport and column count, minimum 6 items
  const itemCount = Math.max(Math.min(columnCount * 3, 12), 6);

  // Calculate opacity gradient from 100% to 20%
  const getOpacity = (index: number) => 1 - (index / (itemCount - 1)) * 0.8;

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
      }}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          className={styles.card}
          key={index}
          style={{
            height: heights[index % heights.length],
            opacity: getOpacity(index),
          }}
        />
      ))}
    </div>
  );
});

MasonryViewSkeleton.displayName = 'MasonryViewSkeleton';

export default MasonryViewSkeleton;
