'use client';

import { Center } from '@lobehub/ui';
import { memo } from 'react';

import styles from './index.module.css';

interface VideoViewerProps {
  fileId: string;
  url: string | null;
}

const VideoViewer = memo<VideoViewerProps>(({ url }) => {
  if (!url) return null;

  return (
    <Center className={styles.container} height={'100%'} width={'100%'}>
      <video controls className={styles.video} height={'100%'} src={url} width={'100%'} />
    </Center>
  );
});

export default VideoViewer;
