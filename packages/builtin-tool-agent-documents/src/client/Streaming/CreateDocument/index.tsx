'use client';

import type { BuiltinStreamingProps } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { FileTextIcon } from 'lucide-react';
import { memo } from 'react';

import BubblesLoading from '@/components/BubblesLoading';
import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import StreamingMarkdown from '@/components/StreamingMarkdown';

import type { CreateDocumentArgs } from '../../../types';
import styles from './index.module.css';

export const CreateDocumentStreaming = memo<BuiltinStreamingProps<CreateDocumentArgs>>(
  ({ args }) => {
    const { content, title } = args || {};

    if (!content && !title) return null;

    return (
      <Flexbox className={styles.container}>
        <Flexbox horizontal align={'center'} className={styles.header} gap={8}>
          <FileTextIcon className={styles.icon} size={16} />
          <Flexbox flex={1}>
            <div className={styles.title}>{title}</div>
          </Flexbox>
          <NeuralNetworkLoading size={20} />
        </Flexbox>
        {!content ? (
          <Flexbox paddingBlock={16} paddingInline={12}>
            <BubblesLoading />
          </Flexbox>
        ) : (
          <StreamingMarkdown>{content}</StreamingMarkdown>
        )}
      </Flexbox>
    );
  },
);

CreateDocumentStreaming.displayName = 'AgentDocumentsCreateDocumentStreaming';

export default CreateDocumentStreaming;
