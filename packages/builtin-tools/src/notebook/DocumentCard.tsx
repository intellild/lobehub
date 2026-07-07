'use client';

import { ActionIcon, CopyButton, Flexbox, Markdown, ScrollShadow, TooltipGroup } from '@lobehub/ui';
import { Button } from 'antd';
import { Maximize2, Minimize2, NotebookText, PencilLine } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { chatPortalSelectors } from '@/store/chat/slices/portal/selectors';

import styles from './DocumentCard.module.css';
import type { NotebookDocument } from './types';

interface DocumentCardProps {
  document: NotebookDocument;
}

const DocumentCard = memo<DocumentCardProps>(({ document }) => {
  const { t } = useTranslation('plugin');
  const [portalDocumentId, openDocument, closeDocument] = useChatStore((s) => [
    chatPortalSelectors.portalDocumentId(s),
    s.openDocument,
    s.closeDocument,
  ]);

  const isExpanded = portalDocumentId === document.id;

  const handleToggle = () => {
    if (isExpanded) {
      closeDocument();
    } else {
      openDocument(document.id);
    }
  };

  return (
    <Flexbox className={styles.container}>
      {/* Header */}
      <Flexbox horizontal align={'center'} className={styles.header} gap={8}>
        <NotebookText className={styles.icon} size={16} />
        <Flexbox flex={1}>
          <div className={styles.title}>{document.title}</div>
        </Flexbox>
        <TooltipGroup>
          <Flexbox horizontal gap={4}>
            <CopyButton
              content={document.content}
              size={'small'}
              title={t('builtins.lobe-notebook.actions.copy')}
            />
            <ActionIcon
              icon={PencilLine}
              size={'small'}
              title={t('builtins.lobe-notebook.actions.edit')}
              onClick={handleToggle}
            />
          </Flexbox>
        </TooltipGroup>
      </Flexbox>
      {/* Content */}
      <ScrollShadow className={styles.content} offset={12} size={12} style={{ maxHeight: 400 }}>
        <Markdown style={{ overflow: 'unset', paddingBottom: 40 }} variant={'chat'}>
          {document.content}
        </Markdown>
      </ScrollShadow>

      {/* Floating expand/collapse button */}
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
    </Flexbox>
  );
});

export default DocumentCard;
