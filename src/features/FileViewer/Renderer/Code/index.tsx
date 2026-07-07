'use client';

import { Center, Flexbox, Highlighter } from '@lobehub/ui';
import { memo } from 'react';

import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import { getLanguageFromFilename } from '@/utils/fileLanguage';

import { useTextFileLoader } from '../../hooks/useTextFileLoader';
import styles from './index.module.css';

interface CodeViewerProps {
  fileId: string;
  fileName?: string;
  url: string | null;
}

const CodeViewer = memo<CodeViewerProps>(({ url, fileName }) => {
  const { fileData, loading } = useTextFileLoader(url);
  const language = getLanguageFromFilename(fileName);

  return (
    <Flexbox className={styles.page}>
      {!loading && fileData ? (
        <Highlighter language={language} showLanguage={false} variant={'borderless'}>
          {fileData}
        </Highlighter>
      ) : (
        <Center height={'100%'}>
          <NeuralNetworkLoading size={36} />
        </Center>
      )}
    </Flexbox>
  );
});

export default CodeViewer;
