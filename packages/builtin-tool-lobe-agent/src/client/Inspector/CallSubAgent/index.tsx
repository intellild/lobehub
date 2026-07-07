'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { GroupBotIcon } from '@lobehub/ui/icons';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { CallSubAgentParams, CallSubAgentState } from '../../../types';
import { SubAgentStats } from '../../components/SubAgentStats';
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

/**
 * Collapsed row for lobe-agent's `callSubAgent`. Mirrors the Claude Code Agent
 * tool: leading bot icon + "Call SubAgent" label + the description in a chip.
 * Once the run finishes, the persisted state feeds a compact stats tail
 * (tool count · model · tokens).
 */
export const CallSubAgentInspector = memo<
  BuiltinInspectorProps<CallSubAgentParams, CallSubAgentState>
>(({ args, partialArgs, pluginState, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');

  const description = (args?.description || partialArgs?.description)?.trim();
  const isShiny = isArgumentsStreaming || isLoading;

  return (
    <div
      className={cx(inspectorTextStyles.root, styles.root, isShiny && shinyTextStyles.shinyText)}
    >
      <GroupBotIcon className={styles.icon} size={14} />
      <span className={styles.label}>{t('builtins.lobe-agent.apiName.callSubAgent')}</span>
      {description && <span className={styles.chip}>{description}</span>}
      {!isShiny && pluginState && (
        <SubAgentStats
          model={pluginState.model}
          totalTokens={pluginState.totalTokens}
          totalToolCalls={pluginState.totalToolCalls}
        />
      )}
    </div>
  );
});

CallSubAgentInspector.displayName = 'CallSubAgentInspector';

export default CallSubAgentInspector;
