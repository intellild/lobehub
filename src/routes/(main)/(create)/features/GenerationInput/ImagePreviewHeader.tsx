'use client';

import { Flexbox } from '@lobehub/ui';
import type { PropsWithChildren } from 'react';
import { memo } from 'react';

import styles from './ImagePreviewHeader.module.css';

const ImagePreviewHeader = memo<PropsWithChildren>(({ children }) => {
  if (!children) return null;

  return (
    <Flexbox className={styles.container} gap={8}>
      {children}
    </Flexbox>
  );
});

ImagePreviewHeader.displayName = 'ImagePreviewHeader';

export default ImagePreviewHeader;
