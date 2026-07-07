'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import styles from './index.module.css';

interface MSDocViewerProps {
  fileId: string;
  url: string | null;
}

const MSDocViewer = memo<MSDocViewerProps>(({ url }) => {
  if (!url) return null;

  return (
    <Flexbox className={styles.container} height={'100%'} id="msdoc-renderer" width={'100%'}>
      <iframe
        className={styles.content}
        id="msdoc-iframe"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
        title="msdoc-iframe"
      />
    </Flexbox>
  );
});

export default MSDocViewer;
