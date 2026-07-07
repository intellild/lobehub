'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox, Markdown, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './CollabToolRender.module.css';
import type { CodexCollabToolArgs, CodexCollabToolState } from './collabToolUtils';
import {
  formatCollabStatus,
  getCollabAgentEntries,
  getCollabPrompt,
  getCollabStatusTone,
} from './collabToolUtils';

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

const STATUS_DOT_CLASS = {
  error: styles.statusDotError,
  muted: undefined,
  processing: styles.statusDotProcessing,
  success: styles.statusDotSuccess,
};

const CollabToolRender = memo<
  BuiltinRenderProps<CodexCollabToolArgs, CodexCollabToolState, string>
>(({ args, pluginState }) => {
  const { t } = useTranslation('plugin');
  const prompt = getCollabPrompt(args, pluginState);
  const agents = getCollabAgentEntries(args, pluginState);

  if (!prompt && agents.length === 0) return null;

  return (
    <Flexbox gap={12}>
      {prompt && (
        <div>
          <Text className={styles.sectionLabel}>
            {t('builtins.codex.collabTool.instruction', { defaultValue: 'Instruction' })}
          </Text>
          <Flexbox className={styles.promptBox}>
            <Markdown style={{ maxHeight: 240, overflow: 'auto' }} variant={'chat'}>
              {prompt}
            </Markdown>
          </Flexbox>
        </div>
      )}
      {agents.length > 0 && (
        <div>
          <Text className={styles.sectionLabel}>
            {t('builtins.codex.collabTool.agents', { defaultValue: 'Subagents' })}
          </Text>
          <Flexbox gap={8}>
            {agents.map((agent, index) => (
              <Flexbox className={styles.agentRow} gap={4} key={agent.id}>
                <Flexbox horizontal align={'center'} className={styles.agentHeader} gap={6}>
                  <span
                    className={cx(
                      styles.statusDot,
                      STATUS_DOT_CLASS[getCollabStatusTone(agent.status)],
                    )}
                  />
                  <span>
                    {t('builtins.codex.collabTool.agentLabel', {
                      defaultValue: 'Subagent {{index}}',
                      index: index + 1,
                    })}
                  </span>
                  {agent.status && <span>· {formatCollabStatus(agent.status)}</span>}
                </Flexbox>
                {agent.message && (
                  <Markdown style={{ maxHeight: 320, overflow: 'auto' }} variant={'chat'}>
                    {agent.message}
                  </Markdown>
                )}
              </Flexbox>
            ))}
          </Flexbox>
        </div>
      )}
    </Flexbox>
  );
});

CollabToolRender.displayName = 'CodexCollabToolRender';

export default CollabToolRender;
