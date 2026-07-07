'use client';

import { Button, Flexbox, Icon, Tag, Text } from '@lobehub/ui';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Database,
  FlaskConical,
  Gauge,
  LoaderPinwheel,
  Play,
  Server,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Volleyball,
  Zap,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import WorkspaceLink from '@/features/Workspace/WorkspaceLink';

import Sparkline from '../Sparkline';
import StatusBadge from '../StatusBadge';
import styles from './index.module.css';

const SYSTEM_ICONS = [
  LoaderPinwheel,
  Volleyball,
  Server,
  Target,
  Award,
  Trophy,
  Activity,
  BarChart3,
  TrendingUp,
  Gauge,
  Zap,
];

const getSystemIcon = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return SYSTEM_ICONS[hash % SYSTEM_ICONS.length];
};

interface BenchmarkCardProps {
  bestScore?: number;
  datasetCount?: number;
  description?: string;
  id: string;
  name: string;
  recentRuns?: any[];
  runCount?: number;
  source?: 'system' | 'user';
  tags?: string[];
  testCaseCount?: number;
}

// One labeled figure in the stat strip (big mono number over a quiet label).
const Stat = memo<{ label: string; value: number | string }>(({ value, label }) => (
  <Flexbox gap={2}>
    <Text className={styles.statValue} fontSize={16}>
      {value}
    </Text>
    <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
      {label}
    </Text>
  </Flexbox>
));

const BenchmarkCard = memo<BenchmarkCardProps>(
  ({
    id,
    name,
    description,
    testCaseCount,
    recentRuns,
    runCount = 0,
    bestScore,
    source,
    tags,
    datasetCount = 0,
  }) => {
    const { t } = useTranslation('eval');
    const allRunCount = runCount || recentRuns?.length || 0;
    const hasDatasets = datasetCount > 0;
    const systemIcon = useMemo(() => getSystemIcon(id), [id]);
    const isUser = source === 'user';

    // Pass-rate trend: recentRuns arrives newest-first, so reverse a copy to read
    // left→right oldest→newest. Drop runs that never produced a rate.
    const trend = useMemo(() => {
      const rates = (recentRuns ?? [])
        .map((r) => r?.metrics?.passRate)
        .filter((v): v is number => typeof v === 'number');
      return rates.reverse();
    }, [recentRuns]);

    const bestRate = trend.length > 0 ? Math.max(...trend) : undefined;
    const latestRun = recentRuns?.[0];

    return (
      <Flexbox className={styles.card} gap={16} justify={'space-between'} padding={20}>
        <Flexbox gap={16}>
          {/* Identity */}
          <Flexbox horizontal align={'flex-start'} gap={12} justify={'space-between'}>
            <Flexbox horizontal align={'center'} gap={12} style={{ minWidth: 0 }}>
              <div
                className={styles.iconBox}
                style={{ background: isUser ? 'var(--ant-color-success-bg)' : 'var(--ant-color-primary-bg)' }}
              >
                <Icon
                  icon={isUser ? User : systemIcon}
                  size={22}
                  style={{ color: isUser ? 'var(--ant-color-success)' : 'var(--ant-color-primary)' }}
                />
              </div>
              <Flexbox gap={2} style={{ minWidth: 0 }}>
                <WorkspaceLink className={styles.name} to={`/eval/bench/${id}`}>
                  {name}
                </WorkspaceLink>
                {description && (
                  <Text color={'var(--ant-color-text-tertiary)'} fontSize={12} lineClamp={1}>
                    {description}
                  </Text>
                )}
              </Flexbox>
            </Flexbox>
            <WorkspaceLink className={styles.detailLink} to={`/eval/bench/${id}`}>
              <Icon icon={ArrowRight} size={16} />
            </WorkspaceLink>
          </Flexbox>

          {/* Hero metric band — headline pass rate + trend, or a focused CTA */}
          {!hasDatasets ? (
            <Flexbox align={'center'} className={styles.ctaBand} gap={8}>
              <Icon icon={Database} size={24} style={{ color: 'var(--ant-color-text-quaternary)' }} />
              <Flexbox align={'center'} gap={2}>
                <Text color={'var(--ant-color-text-tertiary)'}>{t('benchmark.card.noDataset')}</Text>
                <Text color={'var(--ant-color-text-quaternary)'} fontSize={12}>
                  {t('benchmark.card.noDatasetHint')}
                </Text>
              </Flexbox>
              <WorkspaceLink style={{ textDecoration: 'none' }} to={`/eval/bench/${id}`}>
                <Button icon={Upload} size={'small'} variant={'filled'}>
                  {t('benchmark.card.importDataset')}
                </Button>
              </WorkspaceLink>
            </Flexbox>
          ) : bestRate !== undefined ? (
            <Flexbox
              horizontal
              align={'center'}
              className={styles.metricBand}
              justify={'space-between'}
            >
              <Flexbox gap={4}>
                <span className={styles.metricValue}>{(bestRate * 100).toFixed(0)}%</span>
                <Flexbox horizontal align={'center'} gap={8}>
                  <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
                    {t('benchmark.card.bestPassRate')}
                  </Text>
                  {latestRun?.status && <StatusBadge status={latestRun.status} />}
                </Flexbox>
              </Flexbox>
              {trend.length > 1 && <Sparkline values={trend} />}
            </Flexbox>
          ) : (
            <Flexbox align={'center'} className={styles.ctaBand} gap={8}>
              <Icon icon={FlaskConical} size={24} style={{ color: 'var(--ant-color-text-quaternary)' }} />
              <Flexbox align={'center'} gap={2}>
                <Text color={'var(--ant-color-text-tertiary)'}>{t('benchmark.card.empty')}</Text>
                <Text color={'var(--ant-color-text-quaternary)'} fontSize={12}>
                  {t('benchmark.card.emptyHint')}
                </Text>
              </Flexbox>
              <WorkspaceLink style={{ textDecoration: 'none' }} to={`/eval/bench/${id}?tab=runs`}>
                <Button icon={Play} size={'small'} variant={'filled'}>
                  {t('benchmark.card.startFirst')}
                </Button>
              </WorkspaceLink>
            </Flexbox>
          )}
        </Flexbox>

        {/* Stat strip + tags (pinned) */}
        <Flexbox gap={16}>
          <Flexbox horizontal align={'center'} gap={20}>
            <Stat label={t('sidebar.datasets')} value={datasetCount} />
            <span className={styles.statDivider} />
            <Stat label={t('benchmark.card.casesLabel')} value={testCaseCount || 0} />
            <span className={styles.statDivider} />
            <Stat label={t('benchmark.card.evalsLabel')} value={allRunCount} />
            {bestScore !== undefined && (
              <>
                <span className={styles.statDivider} />
                <Stat label={t('benchmark.card.bestScore')} value={bestScore.toFixed(1)} />
              </>
            )}
          </Flexbox>

          {tags && tags.length > 0 && (
            <Flexbox horizontal gap={4} style={{ flexWrap: 'wrap' }}>
              {tags.slice(0, 4).map((tag) => (
                <Tag key={tag} size={'small'}>
                  {tag}
                </Tag>
              ))}
              {tags.length > 4 && <Tag size={'small'}>+{tags.length - 4}</Tag>}
            </Flexbox>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default BenchmarkCard;
