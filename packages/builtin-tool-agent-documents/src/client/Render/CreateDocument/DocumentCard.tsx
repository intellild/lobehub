'use client';

import { ActionIcon, CopyButton, Flexbox, Markdown, ScrollShadow, TooltipGroup } from '@lobehub/ui';
import { Button } from 'antd';
import { FileTextIcon, Maximize2, Minimize2, PencilLine } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { chatPortalSelectors } from '@/store/chat/slices/portal/selectors';

import styles from './DocumentCard.module.css';

interface DocumentCardProps {
  content: string;
  documentId?: string;
  title: string;
}

const DocumentCard = memo<DocumentCardProps>(({ content, documentId, title }) => {
  const { t } = useTranslation('plugin');
  const [portalDocumentId, openDocument, closeDocument] = useChatStore((s) => [
    chatPortalSelectors.portalDocumentId(s),
    s.openDocument,
    s.closeDocument,
  ]);

  const isExpanded = !!documentId && portalDocumentId === documentId;

  const handleToggle = () => {
    if (!documentId) return;
    if (isExpanded) {
      closeDocument();
    } else {
      openDocument(documentId);
    }
  };

  return (
    <Flexbox className={styles.container}>
      <Flexbox horizontal align={'center'} className={styles.header} gap={8}>
        <FileTextIcon className={styles.icon} size={16} />
        <Flexbox flex={1}>
          <div className={styles.title}>{title}</div>
        </Flexbox>
        <TooltipGroup>
          <Flexbox horizontal gap={4}>
            <CopyButton
              content={content}
              size={'small'}
              title={t('builtins.lobe-notebook.actions.copy')}
            />
            {documentId && (
              <ActionIcon
                icon={PencilLine}
                size={'small'}
                title={t('builtins.lobe-notebook.actions.edit')}
                onClick={handleToggle}
              />
            )}
          </Flexbox>
        </TooltipGroup>
      </Flexbox>
      <ScrollShadow className={styles.content} offset={12} size={12} style={{ maxHeight: 400 }}>
        <Markdown style={{ overflow: 'unset', paddingBottom: 40 }} variant={'chat'}>
          {content}
        </Markdown>
      </ScrollShadow>

      {documentId && (
        <Button
          className={styles.expandButton}
          color={'default'}
          icon={isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          shape={'round'}
          variant={'outlined'}
          onClick={handleToggle}
        >
          {isExpanded
            ? t('builtins.lobe-notebook.actions.collapse')
            : t('builtins.lobe-notebook.actions.expand')}
        </Button>
      )}
    </Flexbox>
  );
});

export default DocumentCard;
