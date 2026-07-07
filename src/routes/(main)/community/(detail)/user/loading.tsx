'use client';

import { Flexbox, Skeleton } from '@lobehub/ui';
import { memo } from 'react';

import ListLoading from '@/routes/(main)/community/components/ListLoading';

import Banner from './features/Header/Banner';

const Loading = memo(() => {
  return (
    <Flexbox gap={24} width={'100%'}>
      {/* User Header Skeleton */}
      <Banner />
      <Flexbox gap={16}>
        <Skeleton.Avatar
          shape={'square'}
          size={64}
          style={{ boxShadow: `0 0 0 4px ${'var(--ant-color-bg-container)'}`, flexShrink: 0 }}
        />
        <Skeleton paragraph={{ rows: 1 }} />
      </Flexbox>

      {/* Agent List Skeleton */}
      <ListLoading length={4} rows={4} />
    </Flexbox>
  );
});

export default Loading;
