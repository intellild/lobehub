'use client';

import type { EvalRunTopicResult } from '@lobechat/types';
import { formatCost, formatShortenNumber } from '@lobechat/utils';
import { ActionIcon, Flexbox, Icon, Text } from '@lobehub/ui';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Footprints,
  Hash,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';

interface CaseHeaderProps {
  caseNumber: number;
  evalResult?: EvalRunTopicResult | null;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  passed?: boolean | null;
  runName: string;
  score?: number | null;
}

const CaseHeader = memo<CaseHeaderProps>(
  ({ passed, caseNumber, runName, evalResult, onBack, onPrev, onNext, score }) => {
    const { t } = useTranslation('eval');

    // Resolve the outcome: error (run threw) > failed > passed > unknown.
    // Color is always paired with an icon + label, never used alone.
    const hasError = !!evalResult?.error;
    const outcome = hasError
      ? {
          bg: 'var(--ant-color-error-bg)',
          color: 'var(--ant-color-error)',
          icon: TriangleAlert,
          label: t('table.filter.error'),
        }
      : passed === true
        ? {
            bg: 'var(--ant-color-success-bg)',
            color: 'var(--ant-color-success)',
            icon: CheckCircle2,
            label: t('table.filter.passed'),
          }
        : passed === false
          ? {
              bg: 'var(--ant-color-error-bg)',
              color: 'var(--ant-color-error)',
              icon: XCircle,
              label: t('table.filter.failed'),
            }
          : null;

    const hasScore = score !== undefined && score !== null;

    const metrics = [
      {
        icon: Clock,
        label: t('caseDetail.duration'),
        value: evalResult?.duration != null ? `${(evalResult.duration / 1000).toFixed(1)}s` : null,
      },
      {
        icon: Footprints,
        label: t('caseDetail.steps'),
        value: evalResult?.steps != null ? String(evalResult.steps) : null,
      },
      {
        icon: DollarSign,
        label: t('caseDetail.cost'),
        value: evalResult?.cost != null ? `$${formatCost(evalResult.cost)}` : null,
      },
      {
        icon: Hash,
        label: t('caseDetail.tokens'),
        value: evalResult?.tokens != null ? formatShortenNumber(evalResult.tokens) : null,
      },
    ].filter((m) => m.value !== null);

    return (
      <Flexbox className={styles.header} gap={16}>
        {/* Identity row: breadcrumb back + case number + prev/next nav */}
        <Flexbox horizontal align="center" gap={8} justify="space-between">
          <Flexbox gap={4}>
            <Flexbox
              horizontal
              align="center"
              className={styles.backLink}
              gap={4}
              role="button"
              tabIndex={0}
              onClick={onBack}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onBack();
                }
              }}
            >
              <ArrowLeft size={12} />
              <Text fontSize={12}>{runName}</Text>
            </Flexbox>
            <Text as="h4" style={{ fontSize: 20, margin: 0 }} weight={600}>
              #{caseNumber}
            </Text>
          </Flexbox>

          <Flexbox horizontal align="center" gap={8}>
            <ActionIcon disabled={!onPrev} icon={ChevronLeft} size="small" onClick={onPrev} />
            <ActionIcon disabled={!onNext} icon={ChevronRight} size="small" onClick={onNext} />
          </Flexbox>
        </Flexbox>

        {/* Outcome hero — the result is the centerpiece */}
        {(outcome || hasScore) && (
          <Flexbox horizontal align="center" className={styles.hero} gap={16}>
            {outcome && (
              <Flexbox horizontal align="center" flex={1} gap={12}>
                <div className={styles.statusTile} style={{ background: outcome.bg }}>
                  <Icon icon={outcome.icon} size={24} style={{ color: outcome.color }} />
                </div>
                <span className={styles.statusLabel} style={{ color: outcome.color }}>
                  {outcome.label}
                </span>
              </Flexbox>
            )}

            {hasScore && (
              <Flexbox align="flex-end" gap={2}>
                <span className={styles.scoreValue}>{score.toFixed(2)}</span>
                <span className={styles.metricLabel}>{t('caseDetail.score')}</span>
              </Flexbox>
            )}
          </Flexbox>
        )}

        {/* Runtime metric pills */}
        {metrics.length > 0 && (
          <Flexbox horizontal align="center" gap={8} wrap="wrap">
            {metrics.map((m) => (
              <Flexbox horizontal align="center" className={styles.metricCard} key={m.label}>
                <div className={styles.metricIcon}>
                  <m.icon size={14} />
                </div>
                <Flexbox gap={0}>
                  <span className={styles.metricLabel}>{m.label}</span>
                  <span className={styles.metricValue}>{m.value}</span>
                </Flexbox>
              </Flexbox>
            ))}
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);

export default CaseHeader;
