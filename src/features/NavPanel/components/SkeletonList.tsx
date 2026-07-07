'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';

export const SkeletonItem = memo<{ avatarSize?: number } & Omit<FlexboxProps, 'children'>>(
  ({ padding = 6, height = 36, style, avatarSize = 28, ...rest }) => {
    return (
      <Flexbox
        horizontal
        align={'center'}
        flex={1}
        gap={8}
        height={height}
        padding={padding}
        style={style}
        {...rest}
      >
        <Skeleton.Button
          size={'small'}
          style={{
            borderRadius: 'var(--ant-border-radius)',
            height: avatarSize,
            maxHeight: avatarSize,
            maxWidth: avatarSize,
            minWidth: avatarSize,
          }}
        />
        <Flexbox flex={1} height={16}>
          <Skeleton.Button
            active
            block
            size={'small'}
            style={{
              borderRadius: 'var(--ant-border-radius)',
              height: 16,
              margin: 0,
              maxHeight: 16,
              opacity: 0.5,
              padding: 0,
            }}
          />
        </Flexbox>
      </Flexbox>
    );
  },
);

export const SkeletonList = memo<{ rows?: number } & Omit<FlexboxProps, 'children'>>(
  ({ rows = 3, ...rest }) => {
    return (
      <Flexbox gap={2} {...rest}>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </Flexbox>
    );
  },
);

export default SkeletonList;
