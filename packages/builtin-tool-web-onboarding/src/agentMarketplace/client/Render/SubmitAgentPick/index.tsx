'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Avatar, Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { InstallMarketplaceAgentSummary } from '../../../pickResult';
import type { SubmitAgentPickArgs } from '../../../types';
import styles from './index.module.css';

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

interface SubmitAgentPickState {
  installedAgentIds?: string[];
  selectedAgentIds?: string[];
  skippedAgentIds?: string[];
  summaries?: InstallMarketplaceAgentSummary[];
}

export type SubmitAgentPickRenderProps = Pick<
  BuiltinRenderProps<SubmitAgentPickArgs, SubmitAgentPickState>,
  'pluginState'
>;

const SubmitAgentPick = memo<SubmitAgentPickRenderProps>(({ pluginState }) => {
  const { t } = useTranslation('tool');
  const summaries = pluginState?.summaries ?? [];

  if (summaries.length === 0) return null;

  const installedCount = summaries.filter((s) => !s.skipped).length;
  const skippedCount = summaries.length - installedCount;

  return (
    <Flexbox gap={12}>
      <Text style={{ fontSize: 13 }} type="secondary">
        {t('agentMarketplace.inspector.pickCount', { count: installedCount })}
        {skippedCount > 0 &&
          ` · ${t('agentMarketplace.render.alreadyInLibrary', { count: skippedCount })}`}
      </Text>
      <div className={styles.list}>
        {summaries.map((summary) => (
          <div
            className={cx(styles.card, summary.skipped && styles.cardSkipped)}
            key={summary.templateId}
          >
            <Avatar avatar={summary.avatar || '🤖'} shape="square" size={36} />
            <Flexbox flex={1} gap={4} style={{ minWidth: 0 }}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{summary.title || summary.templateId}</span>
                {summary.skipped && (
                  <span className={styles.skippedTag}>
                    {t('agentMarketplace.render.alreadyInLibraryTag')}
                  </span>
                )}
              </div>
              {summary.description && (
                <div className={styles.description}>{summary.description}</div>
              )}
            </Flexbox>
          </div>
        ))}
      </div>
    </Flexbox>
  );
});

SubmitAgentPick.displayName = 'SubmitAgentPick';

export default SubmitAgentPick;
