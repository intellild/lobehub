'use client';

import type { AgentEvalRunListItem } from '@lobechat/types';
import { formatCost } from '@lobechat/utils';
import { Button, type DropdownItem, DropdownMenu, Flexbox, Icon, Text } from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import {
  CircleDollarSign,
  Clock,
  Edit,
  EllipsisVertical,
  Layers,
  Server,
  Trash2,
  Trophy,
  User,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useEvalStore } from '@/store/eval';

import { createBenchmarkEditModal } from '../../../../features/BenchmarkEditModal';
import Sparkline from '../../../../features/Sparkline';
import { formatDuration, formatDurationMinutes } from '../../../../utils';
import styles from './index.module.css';

const RANK_COLORS = ['var(--ant-color-primary)', 'var(--ant-color-success)', 'var(--ant-color-text-quaternary)'];

interface BenchmarkHeaderProps {
  benchmark: any;
  completedRuns: AgentEvalRunListItem[];
  datasets: any[];
  onBenchmarkUpdate?: (benchmark: any) => void;
  runCount: number;
  systemIcon?: LucideIcon;
  totalCases: number;
}

const BenchmarkHeader = memo<BenchmarkHeaderProps>(
  ({
    benchmark,
    completedRuns,
    datasets,
    onBenchmarkUpdate,
    runCount,
    systemIcon = Server,
    totalCases,
  }) => {
    const { t } = useTranslation('eval');
    const navigate = useWorkspaceAwareNavigate();
    const deleteBenchmark = useEvalStore((s) => s.deleteBenchmark);
    const refreshBenchmarkDetail = useEvalStore((s) => s.refreshBenchmarkDetail);

    const handleEditSuccess = async () => {
      await refreshBenchmarkDetail(benchmark.id);
      onBenchmarkUpdate?.(benchmark);
    };

    const handleEdit = () => createBenchmarkEditModal({ benchmark, onSuccess: handleEditSuccess });

    const handleDelete = () => {
      confirmModal({
        content: t('benchmark.actions.delete.confirm'),
        okButtonProps: { danger: true },
        okText: t('benchmark.actions.delete'),
        onOk: async () => {
          await deleteBenchmark(benchmark.id);
          navigate('/eval');
        },
        title: t('benchmark.actions.delete'),
      });
    };

    const menuItems: DropdownItem[] = [
      {
        danger: true,
        icon: <Trash2 size={16} />,
        key: 'delete',
        label: t('common.delete'),
        onClick: handleDelete,
      },
    ];

    // === Stats Computations ===

    const hasDatasets = datasets.length > 0;
    const hasCompletedRuns = completedRuns.length > 0;

    // Top Agents: group by targetAgent, compute avg passRate, sort desc, take top 3
    const topAgents = useMemo(() => {
      if (!hasCompletedRuns) return [];
      const agentMap = new Map<string, { name: string; passRates: number[] }>();
      for (const run of completedRuns) {
        const agentName = run.targetAgent?.title || run.targetAgent?.id || 'Unknown';
        const agentId = run.targetAgentId || run.targetAgent?.id || agentName;
        if (!agentMap.has(agentId)) {
          agentMap.set(agentId, { name: agentName, passRates: [] });
        }
        agentMap.get(agentId)!.passRates.push(run.passRate ?? run.metrics?.passRate ?? 0);
      }
      return [...agentMap.entries()]
        .map(([, v]) => ({
          avgPassRate: v.passRates.reduce((a, b) => a + b, 0) / v.passRates.length,
          name: v.name,
        }))
        .sort((a, b) => b.avgPassRate - a.avgPassRate)
        .slice(0, 3);
    }, [completedRuns, hasCompletedRuns]);

    // Best agent for the summary line
    const bestAgent = topAgents.length > 0 ? topAgents[0] : null;

    // Pass-rate trend across completed runs (reversed to read oldest→newest) for
    // the hero sparkline; the best rate anchors the headline number.
    const passRateTrend = useMemo(() => {
      const rates = completedRuns
        .map((r) => r.passRate ?? r.metrics?.passRate)
        .filter((v): v is number => typeof v === 'number');
      return rates.reverse();
    }, [completedRuns]);
    const bestPassRate = passRateTrend.length > 0 ? Math.max(...passRateTrend) : undefined;

    // Avg Duration
    const avgDuration = useMemo(() => {
      if (!hasCompletedRuns) return null;
      const durations = completedRuns
        .map((r) => r.metrics?.duration ?? r.totalDuration)
        .filter((d): d is number => d != null && d > 0);
      if (durations.length === 0) return null;
      return durations.reduce((a, b) => a + b, 0) / durations.length;
    }, [completedRuns, hasCompletedRuns]);

    // P99 Duration
    const p99Duration = useMemo(() => {
      if (!hasCompletedRuns) return null;
      const durations = completedRuns
        .map((r) => r.metrics?.duration ?? r.totalDuration)
        .filter((d): d is number => d != null && d > 0)
        .sort((a, b) => a - b);
      if (durations.length === 0) return null;
      const idx = Math.ceil(durations.length * 0.99) - 1;
      return durations[idx];
    }, [completedRuns, hasCompletedRuns]);

    // Avg Cost
    const avgCost = useMemo(() => {
      if (!hasCompletedRuns) return null;
      const costs = completedRuns
        .map((r) => r.metrics?.totalCost ?? r.totalCost)
        .filter((c): c is number => c != null && c > 0);
      if (costs.length === 0) return null;
      return costs.reduce((a, b) => a + b, 0) / costs.length;
    }, [completedRuns, hasCompletedRuns]);

    return (
      <>
        {/* Header */}
        <Flexbox gap={16}>
          <Flexbox horizontal align="start" justify="space-between">
            <Flexbox horizontal align="start" gap={12}>
              <div
                className={styles.iconBox}
                style={{
                  background:
                    benchmark.source === 'user' ? 'var(--ant-color-success-bg)' : 'var(--ant-color-primary-bg)',
                }}
              >
                <Icon
                  icon={benchmark.source === 'user' ? User : systemIcon}
                  size={20}
                  style={{
                    color: benchmark.source === 'user' ? 'var(--ant-color-success)' : 'var(--ant-color-primary)',
                  }}
                />
              </div>
              <Flexbox gap={4}>
                <h1 className={styles.title}>{benchmark.name}</h1>
                {benchmark.description && (
                  <p className={styles.description}>{benchmark.description}</p>
                )}
              </Flexbox>
            </Flexbox>

            <Flexbox horizontal gap={8}>
              <Button icon={Edit} size="small" variant="outlined" onClick={handleEdit}>
                {t('common.edit')}
              </Button>
              <DropdownMenu items={menuItems} placement="bottomRight">
                <Button icon={EllipsisVertical} size="small" variant="outlined" />
              </DropdownMenu>
            </Flexbox>
          </Flexbox>
        </Flexbox>

        {/* Results hero — headline best pass rate + trend across completed runs.
            Always rendered (shows a muted dash before the first completed run) so
            the benchmark always leads with its outcome. */}
        <Flexbox
          horizontal
          align={'center'}
          className={styles.heroBand}
          gap={16}
          justify={'space-between'}
        >
          <Flexbox gap={6}>
            <span className={styles.heroValue}>
              {bestPassRate !== undefined ? `${(bestPassRate * 100).toFixed(0)}%` : '—'}
            </span>
            <Text color={'var(--ant-color-text-secondary)'} fontSize={14}>
              {bestAgent
                ? t('benchmark.detail.stats.bestPerformance', {
                    agent: bestAgent.name,
                    passRate: (bestAgent.avgPassRate * 100).toFixed(1),
                  })
                : t('benchmark.card.bestPassRate')}
            </Text>
          </Flexbox>
          {passRateTrend.length > 1 && <Sparkline values={passRateTrend} width={220} />}
        </Flexbox>

        {/* Stats Cards */}
        <Flexbox horizontal gap={12}>
          {/* Card 1: Top Agents */}
          <div className={styles.statCard}>
            <Flexbox gap={12}>
              <Flexbox horizontal align="center" gap={8}>
                <div className={styles.statIcon} style={{ background: 'var(--ant-color-warning-bg)' }}>
                  <Trophy size={16} style={{ color: 'var(--ant-color-warning)' }} />
                </div>
                <span className={styles.statLabel} style={{ textTransform: 'uppercase' }}>
                  {t('benchmark.detail.stats.topAgents')}
                </span>
              </Flexbox>

              {!hasDatasets && !hasCompletedRuns && (
                <span
                  style={{
                    color: 'var(--ant-color-text-quaternary)',
                    fontSize: 'var(--ant-font-size-xl)',
                    fontWeight: 600,
                  }}
                >
                  --
                </span>
              )}

              {hasDatasets && !hasCompletedRuns && (
                <Flexbox gap={2}>
                  <span
                    style={{
                      color: 'var(--ant-color-text-quaternary)',
                      fontSize: 'var(--ant-font-size-xl)',
                      fontWeight: 600,
                    }}
                  >
                    {t('benchmark.detail.stats.waiting')}
                  </span>
                  <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 'var(--ant-font-size-sm)' }}>
                    {t('benchmark.detail.stats.noEvalRecord')}
                  </span>
                </Flexbox>
              )}

              {hasCompletedRuns && topAgents.length > 0 && (
                <Flexbox gap={6}>
                  {topAgents.map((agent, idx) => (
                    <Flexbox horizontal align="center" justify="space-between" key={agent.name}>
                      <Flexbox horizontal align="center" gap={8}>
                        <span
                          style={{
                            color: RANK_COLORS[idx] || RANK_COLORS[2],
                            fontFamily: 'var(--ant-font-family-code)',
                            fontSize: 'var(--ant-font-size-sm)',
                            fontWeight: 600,
                            minWidth: 14,
                            textAlign: 'center',
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span
                          style={{
                            color: 'var(--ant-color-text)',
                            fontSize: 'var(--ant-font-size)',
                            fontWeight: 500,
                          }}
                        >
                          {agent.name}
                        </span>
                      </Flexbox>
                      <span
                        style={{
                          color: 'var(--ant-color-text-secondary)',
                          fontFamily: 'var(--ant-font-family-code)',
                          fontSize: 'var(--ant-font-size)',
                        }}
                      >
                        {(agent.avgPassRate * 100).toFixed(1)}%
                      </span>
                    </Flexbox>
                  ))}
                </Flexbox>
              )}
            </Flexbox>
          </div>

          {/* Card 2: Data Scale */}
          <div className={styles.statCard}>
            <Flexbox gap={12}>
              <Flexbox horizontal align="center" gap={8}>
                <div className={styles.statIcon} style={{ background: 'var(--ant-color-primary-bg)' }}>
                  <Layers size={16} style={{ color: 'var(--ant-color-primary)' }} />
                </div>
                <span className={styles.statLabel}>
                  {t('benchmark.detail.stats.dataScale')}
                </span>
                {totalCases === 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--ant-color-warning-bg)',
                      borderRadius: 'var(--ant-border-radius-xs)',
                      color: 'var(--ant-color-warning)',
                      fontSize: 'var(--ant-font-size-sm)',
                      paddingBlock: 2,
                      paddingInline: 8,
                    }}
                  >
                    {t('benchmark.detail.stats.needSetup')}
                  </span>
                )}
              </Flexbox>

              <Flexbox gap={2}>
                <Flexbox horizontal align="baseline" gap={4}>
                  <span
                    style={{
                      color: 'var(--ant-color-text)',
                      fontFamily: 'var(--ant-font-family-code)',
                      fontSize: 'var(--ant-font-size-heading-3)',
                      fontWeight: 600,
                    }}
                  >
                    {totalCases}
                  </span>
                  {totalCases > 0 && (
                    <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 'var(--ant-font-size)' }}>
                      Cases
                    </span>
                  )}
                </Flexbox>
                {totalCases === 0 ? (
                  <span style={{ color: 'var(--ant-color-primary)', fontSize: 'var(--ant-font-size-sm)' }}>
                    {t('benchmark.detail.stats.addFirstDataset')}
                  </span>
                ) : (
                  <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 'var(--ant-font-size-sm)' }}>
                    {datasets.length} Datasets
                  </span>
                )}
              </Flexbox>
            </Flexbox>
          </div>

          {/* Card 3: Avg Duration */}
          <div className={styles.statCard}>
            <Flexbox gap={12}>
              <Flexbox horizontal align="center" gap={8}>
                <div className={styles.statIcon} style={{ background: 'var(--ant-color-info-bg)' }}>
                  <Clock size={16} style={{ color: 'var(--ant-color-info)' }} />
                </div>
                <span className={styles.statLabel}>
                  {t('benchmark.detail.stats.avgDuration')}
                </span>
              </Flexbox>

              {avgDuration == null ? (
                <span
                  style={{
                    color: 'var(--ant-color-text-quaternary)',
                    fontSize: 'var(--ant-font-size-xl)',
                    fontWeight: 600,
                  }}
                >
                  --
                </span>
              ) : (
                <Flexbox gap={2}>
                  <Flexbox horizontal align="baseline" gap={4}>
                    <span
                      style={{
                        color: 'var(--ant-color-text)',
                        fontFamily: 'var(--ant-font-family-code)',
                        fontSize: 'var(--ant-font-size-heading-3)',
                        fontWeight: 600,
                      }}
                    >
                      {formatDurationMinutes(avgDuration)}
                    </span>
                    <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 'var(--ant-font-size)' }}>
                      min
                    </span>
                  </Flexbox>
                  {p99Duration != null && (
                    <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 'var(--ant-font-size-sm)' }}>
                      P99: {formatDuration(p99Duration)}
                    </span>
                  )}
                </Flexbox>
              )}
            </Flexbox>
          </div>

          {/* Card 4: Avg Cost */}
          <div className={styles.statCard}>
            <Flexbox gap={12}>
              <Flexbox horizontal align="center" gap={8}>
                <div className={styles.statIcon} style={{ background: 'var(--ant-color-success-bg)' }}>
                  <CircleDollarSign size={16} style={{ color: 'var(--ant-color-success)' }} />
                </div>
                <span className={styles.statLabel}>{t('benchmark.detail.stats.avgCost')}</span>
              </Flexbox>

              {avgCost == null ? (
                <span
                  style={{
                    color: 'var(--ant-color-text-quaternary)',
                    fontSize: 'var(--ant-font-size-xl)',
                    fontWeight: 600,
                  }}
                >
                  --
                </span>
              ) : (
                <Flexbox gap={2}>
                  <Flexbox horizontal align="baseline" gap={4}>
                    <span
                      style={{
                        color: 'var(--ant-color-text)',
                        fontFamily: 'var(--ant-font-family-code)',
                        fontSize: 'var(--ant-font-size-heading-3)',
                        fontWeight: 600,
                      }}
                    >
                      ${formatCost(avgCost)}
                    </span>
                    <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 'var(--ant-font-size)' }}>
                      {t('benchmark.detail.stats.perRun')}
                    </span>
                  </Flexbox>
                  <span style={{ color: 'var(--ant-color-text-quaternary)', fontSize: 'var(--ant-font-size-sm)' }}>
                    {t('benchmark.detail.stats.basedOnLastNRuns', {
                      count: completedRuns.length,
                    })}
                  </span>
                </Flexbox>
              )}
            </Flexbox>
          </div>
        </Flexbox>
      </>
    );
  },
);

export default BenchmarkHeader;
