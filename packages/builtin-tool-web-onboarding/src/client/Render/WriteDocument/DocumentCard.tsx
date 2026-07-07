'use client';

import { CopyButton, Flexbox, Markdown, ScrollShadow, TooltipGroup } from '@lobehub/ui';
import { FileTextIcon } from 'lucide-react';
import { memo } from 'react';

import styles from './DocumentCard.module.css';

interface DocumentCardProps {
  content: string;
  title: string;
}

const DocumentCard = memo<DocumentCardProps>(({ content, title }) => (
  <Flexbox className={styles.container}>
    <Flexbox horizontal align={'center'} className={styles.header} gap={8}>
      <FileTextIcon className={styles.icon} size={16} />
      <Flexbox flex={1}>
        <div className={styles.title}>{title}</div>
      </Flexbox>
      <TooltipGroup>
        <CopyButton content={content} size={'small'} />
      </TooltipGroup>
    </Flexbox>
    <ScrollShadow className={styles.content} offset={12} size={12} style={{ maxHeight: 400 }}>
      <Markdown style={{ overflow: 'unset', paddingBottom: 16 }} variant={'chat'}>
        {content}
      </Markdown>
    </ScrollShadow>
  </Flexbox>
));

export default DocumentCard;
