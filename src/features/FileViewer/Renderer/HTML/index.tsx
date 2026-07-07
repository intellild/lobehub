'use client';

import { Center, Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { InlineHtmlPreview } from '@/components/HtmlPreview';
import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';

import { useTextFileLoader } from '../../hooks/useTextFileLoader';
import styles from './index.module.css';

interface HTMLViewerProps {
  fileId: string;
  url: string | null;
}

const HTMLViewer = memo<HTMLViewerProps>(({ url }) => {
  const { fileData, loading } = useTextFileLoader(url);

  return (
    <Flexbox className={styles.page}>
      {!loading && fileData !== null ? (
        <InlineHtmlPreview content={fileData} />
      ) : (
        <Center height={'100%'}>
          <NeuralNetworkLoading size={36} />
        </Center>
      )}
    </Flexbox>
  );
});

HTMLViewer.displayName = 'HTMLViewer';

export default HTMLViewer;
