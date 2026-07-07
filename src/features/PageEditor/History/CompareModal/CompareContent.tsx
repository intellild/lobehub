'use client';

import { Button, Flexbox, Text } from '@lobehub/ui';
import dayjs from 'dayjs';
import { RotateCcwIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';
import type {
  DocumentHistoryListItem,
  DocumentHistorySaveSource,
} from '@/server/routers/lambda/_schema/documentHistory';

import DocumentHistoryDiff from '../DocumentHistoryDiff';
import { formatHistoryAbsoluteTime } from '../formatHistoryDate';
import styles from './CompareContent.module.css';
import HistorySidebar from './HistorySidebar';

export interface CompareContentProps {
  documentId: string;
  initialHistoryId: string;
  items: DocumentHistoryListItem[];
  onRestore: (item: DocumentHistoryListItem) => void;
  saveSourceLabels: Record<DocumentHistorySaveSource, string>;
}

const CompareContent = memo<CompareContentProps>(
  ({ documentId, initialHistoryId, items, onRestore, saveSourceLabels }) => {
    const { t } = useTranslation('file');

    const [selectedHistoryId, setSelectedHistoryId] = useState<string>(initialHistoryId);

    const selectedItem = useMemo(
      () => items.find((item) => item.id === selectedHistoryId) ?? null,
      [items, selectedHistoryId],
    );

    const authorInfo = useAuthorInfo(selectedItem?.userId);

    if (!selectedItem) return null;

    const canRestore = !selectedItem.isCurrent;

    return (
      <div className={styles.root}>
        <div className={styles.diffArea}>
          <div className={styles.cmpbar}>
            <Flexbox horizontal align={'center'} gap={4}>
              <span className={styles.badgeNew}>{t('pageEditor.history.compareCurrentLabel')}</span>
              <Text className={styles.arrow}>→</Text>
              <span className={styles.badgeOld}>
                {formatHistoryAbsoluteTime(selectedItem.savedAt)}
              </span>
              <Text className={styles.meta} type={'secondary'}>
                {dayjs(selectedItem.savedAt).fromNow()} ·{' '}
                {saveSourceLabels[selectedItem.saveSource]}
              </Text>
              {authorInfo?.fullName && (
                <Text className={styles.meta} title={authorInfo.fullName} type={'secondary'}>
                  · {authorInfo.fullName}
                </Text>
              )}
            </Flexbox>
            {canRestore && (
              <Button icon={RotateCcwIcon} size={'small'} onClick={() => onRestore(selectedItem)}>
                {t('pageEditor.history.restore')} {formatHistoryAbsoluteTime(selectedItem.savedAt)}
              </Button>
            )}
          </div>
          <div className={styles.diffBody}>
            <DocumentHistoryDiff documentId={documentId} historyId={selectedItem.id} />
          </div>
        </div>
        <HistorySidebar
          items={items}
          saveSourceLabels={saveSourceLabels}
          selectedHistoryId={selectedHistoryId}
          onSelect={setSelectedHistoryId}
        />
      </div>
    );
  },
);

CompareContent.displayName = 'CompareContent';

export default CompareContent;
