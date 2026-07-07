'use client';

import { ActionIcon, Flexbox, Tag } from '@lobehub/ui';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { ArrowLeftRightIcon, RotateCcwIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';
import { useEventCallback } from '@/hooks/useEventCallback';
import type { DocumentHistorySaveSource } from '@/server/routers/lambda/_schema/documentHistory';

import { formatHistoryAbsoluteTime, formatHistoryRowTime } from './formatHistoryDate';
import { historyItemSelectors, useHistoryItemsStore } from './HistoryItemsProvider';
import styles from './HistoryListItem.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

type TagColor = 'default' | 'success' | 'purple' | 'geekblue' | 'gold' | 'processing';

const SOURCE_TAG_COLOR: Record<DocumentHistorySaveSource, TagColor> = {
  autosave: 'default',
  llm_call: 'purple',
  manual: 'success',
  restore: 'geekblue',
  system: 'gold',
};

export interface HistoryListItemProps {
  historyId: string;
  onCompare: (historyId: string) => void;
  onRestore: (historyId: string) => void;
}

export const HistoryListItem = memo<HistoryListItemProps>(({ historyId, onCompare, onRestore }) => {
  const { t } = useTranslation(['common', 'file']);
  const item = useHistoryItemsStore(historyItemSelectors.itemById(historyId));
  const isRestoring = useHistoryItemsStore(historyItemSelectors.isRestoring(historyId));
  const authorInfo = useAuthorInfo(item?.userId);

  const handleCompare = useEventCallback(() => {
    onCompare(historyId);
  });

  const handleRestore = useEventCallback(() => {
    onRestore(historyId);
  });

  const handleStopPropagation = useEventCallback((event: MouseEvent) => {
    event.stopPropagation();
  });

  if (!item) return null;

  const timeLabel = formatHistoryRowTime(item.savedAt);
  const saveSourceLabel = t(`pageEditor.history.saveSource.${item.saveSource}`, { ns: 'file' });

  return (
    <div
      className={cx(styles.row, item.isCurrent && styles.rowCurrent)}
      onClick={item.isCurrent ? undefined : handleCompare}
    >
      <Flexbox align={'flex-start'} className={styles.rowMain} gap={4}>
        <Tooltip title={formatHistoryAbsoluteTime(item.savedAt)}>
          <span className={cx(styles.rowTime, item.isCurrent && styles.rowTimeCurrent)}>
            {timeLabel}
          </span>
        </Tooltip>
        <span className={styles.description}>
          {authorInfo?.fullName ? `${authorInfo.fullName} · ` : ''}
          {dayjs(item.savedAt).fromNow()}
        </span>
      </Flexbox>

      <div className={styles.rowRight}>
        {item.isCurrent && (
          <Tag
            className={styles.currentBadge}
            color={'processing'}
            size={'small'}
            variant={'borderless'}
          >
            {t('pageEditor.history.current', { ns: 'file' })}
          </Tag>
        )}

        {!item.isCurrent && (
          <Tag
            className={cx(styles.sourceTag, 'history-source-tag')}
            color={SOURCE_TAG_COLOR[item.saveSource]}
            size={'small'}
            variant={'borderless'}
          >
            {saveSourceLabel}
          </Tag>
        )}
        {!item.isCurrent && (
          <Flexbox
            horizontal
            align={'center'}
            className={cx(styles.actions, 'history-actions')}
            gap={2}
            onClick={handleStopPropagation}
          >
            <ActionIcon
              icon={ArrowLeftRightIcon}
              size={{ blockSize: 26, borderRadius: '50%', size: 14 }}
              title={t('pageEditor.history.compare', { ns: 'file' })}
              onClick={handleCompare}
            />
            <ActionIcon
              icon={RotateCcwIcon}
              loading={isRestoring}
              size={{ blockSize: 26, borderRadius: '50%', size: 14 }}
              title={t('pageEditor.history.restore', { ns: 'file' })}
              onClick={handleRestore}
            />
          </Flexbox>
        )}
      </div>
    </div>
  );
});

HistoryListItem.displayName = 'HistoryListItem';
