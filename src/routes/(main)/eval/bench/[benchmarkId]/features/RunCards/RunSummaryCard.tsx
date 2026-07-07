'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import WorkspaceLink from '@/features/Workspace/WorkspaceLink';
import SegmentBar from '@/routes/(main)/eval/features/SegmentBar';
import StatusBadge from '@/routes/(main)/eval/features/StatusBadge';

import styles from './RunSummaryCard.module.css';

interface RunSummaryCardProps {
  benchmarkId: string;
  id: string;
  metrics?: {
    averageScore?: number;
    passRate?: number;
    totalCases?: number;
  };
  name?: string;
  status: string;
}

const RunSummaryCard = memo<RunSummaryCardProps>(({ id, name, status, metrics, benchmarkId }) => {
  const { t } = useTranslation('eval');
  const isActive = status === 'running' || status === 'pending';

  const passRate = metrics?.passRate;
  const totalCases = metrics?.totalCases ?? 0;
  // Derive a pass/fail split from the headline rate so the breakdown bar matches
  // the number shown — the summary metrics shape carries no per-status counts.
  const passedCases =
    passRate !== undefined && totalCases > 0 ? Math.round(passRate * totalCases) : 0;
  const failedCases = totalCases > 0 ? Math.max(0, totalCases - passedCases) : 0;
  const showResults = !isActive && passRate !== undefined;

  return (
    <WorkspaceLink
      style={{ color: 'inherit', textDecoration: 'none' }}
      to={`/eval/bench/${benchmarkId}/runs/${id}`}
    >
      <Flexbox className={styles.card} gap={10}>
        <Flexbox horizontal align="center" gap={8} justify="space-between">
          <span className={styles.name}>{name || id.slice(0, 8)}</span>
          <StatusBadge status={status} />
        </Flexbox>

        {showResults && (
          <Flexbox gap={8}>
            {/* Pass-rate hero — the run's headline outcome */}
            <Flexbox horizontal align="baseline" gap={6}>
              <span className={styles.passRate}>{Math.round(passRate! * 100)}%</span>
              <span className={styles.unit}>{t('run.metrics.passRate')}</span>
            </Flexbox>
            {totalCases > 0 && (
              <SegmentBar
                segments={[
                  { color: 'var(--ant-color-success)', value: passedCases },
                  { color: 'var(--ant-color-error)', value: failedCases },
                ]}
              />
            )}
            {metrics?.averageScore !== undefined && (
              <Flexbox horizontal align="center" gap={6}>
                <Text fontSize={12} type="secondary">
                  {t('run.metrics.avgScore')}
                </Text>
                <span className={styles.score}>{metrics.averageScore.toFixed(2)}</span>
              </Flexbox>
            )}
          </Flexbox>
        )}
      </Flexbox>
    </WorkspaceLink>
  );
});

export default RunSummaryCard;
