'use client';

import { Button, Flexbox, Text } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { Plus } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { runSelectors, useEvalStore } from '@/store/eval';

import { createRunCreateModal } from '../RunCreateModal';
import { createRunEditModal } from '../RunEditModal';
import EmptyState from './EmptyState';
import styles from './index.module.css';
import RunCard from './RunCard';

interface RunsTabProps {
  benchmarkId: string;
}

const RunsTab = memo<RunsTabProps>(({ benchmarkId }) => {
  const { t } = useTranslation('eval');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const useFetchRuns = useEvalStore((s) => s.useFetchRuns);
  const runList = useEvalStore(runSelectors.runList);
  const refreshRuns = useEvalStore((s) => s.refreshRuns);
  useFetchRuns(benchmarkId);

  const sortedRuns = useMemo(
    () =>
      [...runList].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [runList],
  );

  const filteredRuns = useMemo(() => {
    if (statusFilter === 'all') return sortedRuns;
    if (statusFilter === 'active') {
      return sortedRuns.filter((r) => r.status === 'running' || r.status === 'pending');
    }
    return sortedRuns.filter((r) => r.status === statusFilter);
  }, [sortedRuns, statusFilter]);

  const statusOptions = [
    { label: t('table.filter.all'), value: 'all' },
    { label: t('run.status.completed'), value: 'completed' },
    { label: t('run.filter.active'), value: 'active' },
    { label: t('run.status.idle'), value: 'idle' },
    { label: t('run.status.failed'), value: 'failed' },
    { label: t('run.status.aborted'), value: 'aborted' },
  ];

  return (
    <Flexbox gap={16}>
      {sortedRuns.length > 0 && (
        <Flexbox horizontal align="center" justify="space-between">
          <Flexbox horizontal align="center" gap={8}>
            <Text color={'var(--ant-color-text-tertiary)'}>
              {t('benchmark.detail.runCount', { count: filteredRuns.length })}
            </Text>
            <Select
              options={statusOptions}
              size="small"
              style={{ width: 128 }}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </Flexbox>
          <Button
            icon={Plus}
            size="small"
            type="primary"
            onClick={() => createRunCreateModal({ benchmarkId })}
          >
            {t('run.actions.create')}
          </Button>
        </Flexbox>
      )}

      {sortedRuns.length === 0 ? (
        <EmptyState onCreate={() => createRunCreateModal({ benchmarkId })} />
      ) : filteredRuns.length === 0 ? (
        <Flexbox className={styles.filterEmpty}>
          <Text color={'var(--ant-color-text-tertiary)'}>{t('run.filter.empty')}</Text>
        </Flexbox>
      ) : (
        <div className={styles.grid}>
          {filteredRuns.map((run) => (
            <RunCard
              benchmarkId={benchmarkId}
              key={run.id}
              run={run}
              onEdit={(editingRun) => createRunEditModal({ run: editingRun })}
              onRefresh={refreshRuns}
            />
          ))}
        </div>
      )}
    </Flexbox>
  );
});

export default RunsTab;
