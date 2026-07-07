'use client';

import { ActionIcon, Flexbox, Icon, Text } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';
import { Play, Plus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { runSelectors, useEvalStore } from '@/store/eval';

import styles from './index.module.css';
import RunSummaryCard from './RunSummaryCard';

interface RunCardsProps {
  benchmarkId: string;
  datasetId?: string;
  onCreateRun: () => void;
}

const RunCards = memo<RunCardsProps>(({ datasetId, onCreateRun, benchmarkId }) => {
  const { t } = useTranslation('eval');
  const useFetchDatasetRuns = useEvalStore((s) => s.useFetchDatasetRuns);
  const runList = useEvalStore(runSelectors.datasetRunList(datasetId!));
  useFetchDatasetRuns(datasetId);

  return (
    <Flexbox gap={12}>
      <Flexbox horizontal align="center" justify="space-between">
        <Text weight={600}>{t('benchmark.detail.tabs.runs')}</Text>
        <ActionIcon
          icon={Plus}
          size="small"
          title={t('run.actions.create')}
          onClick={onCreateRun}
        />
      </Flexbox>
      {runList.length === 0 ? (
        <Flexbox className={styles.emptyCard} gap={12}>
          <div className={styles.iconBox}>
            <Icon icon={Play} size={20} style={{ color: 'var(--ant-color-text-quaternary)' }} />
          </div>
          <Flexbox align="center" gap={2}>
            <Text color={'var(--ant-color-text-tertiary)'}>{t('run.empty.title')}</Text>
            <Text color={'var(--ant-color-text-quaternary)'} fontSize={12}>
              {t('run.empty.description')}
            </Text>
          </Flexbox>
          <Button icon={<Plus size={14} />} size="small" type="primary" onClick={onCreateRun}>
            {t('run.actions.create')}
          </Button>
        </Flexbox>
      ) : (
        <Flexbox gap={8}>
          {runList.map((run) => (
            <RunSummaryCard
              benchmarkId={benchmarkId}
              id={run.id}
              key={run.id}
              metrics={run.metrics ?? undefined}
              name={run.name ?? undefined}
              status={run.status}
            />
          ))}
        </Flexbox>
      )}
    </Flexbox>
  );
});

export default RunCards;
