'use client';

import { Flexbox, Text } from '@lobehub/ui';
import dayjs from 'dayjs';
import { type ReactNode } from 'react';
import { memo } from 'react';

import { type GroupBy } from './index';
import styles from './PeriodGroup.module.css';

interface PeriodHeaderProps {
  groupBy?: GroupBy;

  periodKey: string;
}

export const PeriodHeader = memo<PeriodHeaderProps>(({ periodKey, groupBy = 'day' }) => {
  const periodName =
    groupBy === 'month'
      ? dayjs(`${periodKey}-01`).format('MMMM YYYY')
      : dayjs(periodKey).format('MMMM D, YYYY');

  return (
    <Flexbox horizontal align={'center'} className={styles.periodHeader} gap={12} paddingBlock={8}>
      <Text weight={500}>{periodName}</Text>
    </Flexbox>
  );
});

interface TimelineItemWrapperProps {
  children: ReactNode;
}

export const TimelineItemWrapper = memo<TimelineItemWrapperProps>(({ children }) => {
  return (
    <div className={styles.itemWrapper}>
      <div className={styles.timelineDot} />
      {children}
    </div>
  );
});
