'use client';

import { Flexbox } from '@lobehub/ui';
import { memo,Suspense } from 'react';

import NavHeader from '@/features/NavHeader';
import WideScreenButton from '@/features/WideScreenContainer/WideScreenButton';

import ShareButton from './ShareButton';

const Header = memo(() => {
  return (
    <NavHeader
      right={
        <Flexbox horizontal style={{ backgroundColor: 'var(--ant-color-bg-container)' }}>
          <WideScreenButton />
          <Suspense>
            <ShareButton />
          </Suspense>
        </Flexbox>
      }
    />
  );
});

export default Header;
