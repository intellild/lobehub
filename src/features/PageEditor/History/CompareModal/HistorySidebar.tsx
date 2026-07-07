'use client';

import { Flexbox, Tag, Text } from '@lobehub/ui';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthorInfo } from '@/business/client/hooks/useAuthorInfo';
import type {
  DocumentHistoryListItem,
  DocumentHistorySaveSource,
} from '@/server/routers/lambda/_schema/documentHistory';

import { formatHistoryRowTime } from '../formatHistoryDate';
import styles from './HistorySidebar.module.css';

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

interface HistoryDayGroup {
  items: DocumentHistoryListItem[];
  key: string;
  label: string;
}

const createGroups = (
  items: DocumentHistoryListItem[],
  formatLabel: (savedAt: string) => string,
): HistoryDayGroup[] => {
  const groups = new Map<string, HistoryDayGroup>();

  for (const item of items) {
    const key = dayjs(item.savedAt).format('YYYY-MM-DD');
    const group = groups.get(key);

    if (group) {
      group.items.push(item);
      continue;
    }

    groups.set(key, {
      items: [item],
      key,
      label: formatLabel(item.savedAt),
    });
  }

  return [...groups.values()];
};

interface HistorySidebarRowProps {
  isSelected: boolean;
  item: DocumentHistoryListItem;
  onSelect: (historyId: string) => void;
  saveSourceLabels: Record<DocumentHistorySaveSource, string>;
}

const HistorySidebarRow = memo<HistorySidebarRowProps>(
  ({ item, isSelected, onSelect, saveSourceLabels }) => {
    const { t } = useTranslation('file');
    const authorInfo = useAuthorInfo(item.userId);
    const disabled = item.isCurrent;

    return (
      <div className={styles.row}>
        <div
          className={cx(
            styles.dot,
            item.isCurrent && styles.dotCurrent,
            !item.isCurrent && isSelected && styles.dotSelected,
          )}
        />
        <div
          className={cx(
            styles.item,
            item.isCurrent && styles.itemCurrent,
            !item.isCurrent && isSelected && styles.itemSelected,
          )}
          onClick={() => {
            if (disabled) return;
            onSelect(item.id);
          }}
        >
          <Flexbox gap={2}>
            <Flexbox horizontal align={'center'} gap={4}>
              <Text className={styles.time}>{formatHistoryRowTime(item.savedAt)}</Text>
              {item.isCurrent && (
                <Tag className={styles.tag} variant={'borderless'}>
                  {t('pageEditor.history.current')}
                </Tag>
              )}
              <span className={styles.source}>{saveSourceLabels[item.saveSource]}</span>
            </Flexbox>
            <Text className={styles.meta} type={'secondary'}>
              {authorInfo?.fullName ? `${authorInfo.fullName} · ` : ''}
              {dayjs(item.savedAt).fromNow()}
            </Text>
          </Flexbox>
        </div>
      </div>
    );
  },
);

HistorySidebarRow.displayName = 'HistorySidebarRow';

interface HistorySidebarProps {
  items: DocumentHistoryListItem[];
  onSelect: (historyId: string) => void;
  saveSourceLabels: Record<DocumentHistorySaveSource, string>;
  selectedHistoryId: string | null;
}

const HistorySidebar = memo<HistorySidebarProps>(
  ({ items, onSelect, saveSourceLabels, selectedHistoryId }) => {
    const { t } = useTranslation('file');

    const formatLabel = useCallback(
      (savedAt: string) => {
        const d = dayjs(savedAt);
        if (d.isToday()) return t('pageEditor.history.dayLabel.today');
        if (d.isYesterday()) return t('pageEditor.history.dayLabel.yesterday');
        return d.format('MM-DD');
      },
      [t],
    );

    const groups = useMemo(() => createGroups(items, formatLabel), [formatLabel, items]);

    return (
      <div className={styles.container}>
        {groups.map((group) => (
          <Flexbox gap={0} key={group.key}>
            <div className={styles.groupHeader}>
              <Text type={'secondary'}>{group.label}</Text>
            </div>
            <div className={styles.group}>
              <div className={styles.rail} />
              {group.items.map((item) => (
                <HistorySidebarRow
                  isSelected={selectedHistoryId === item.id}
                  item={item}
                  key={item.id}
                  saveSourceLabels={saveSourceLabels}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </Flexbox>
        ))}
      </div>
    );
  },
);

HistorySidebar.displayName = 'HistorySidebar';

export default HistorySidebar;
