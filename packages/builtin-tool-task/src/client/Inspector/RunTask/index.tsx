'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon } from '@lobehub/ui';
import { Play } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { RunTaskParams, RunTaskState } from '../../../types';
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

export const RunTaskInspector = memo<BuiltinInspectorProps<RunTaskParams, RunTaskState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');

    const params = args || partialArgs || ({} as Partial<RunTaskParams>);
    const identifier = params.identifier;
    const continueTopicId = params.continueTopicId;
    const prompt = params.prompt;

    return (
      <div
        style={{ flexWrap: 'wrap', gap: 4 }}
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <Icon icon={Play} size={12} style={{ color: 'var(--ant-color-warning)' }} />
        <span>{t('builtins.lobe-task.apiName.runTask')}</span>
        {identifier && (
          <span className={styles.identifierChip} style={{ marginInlineStart: 4 }}>
            {identifier}
          </span>
        )}
        {continueTopicId && (
          <>
            <span className={styles.separator}>·</span>
            <span style={{ color: 'var(--ant-color-text-tertiary)', fontSize: 12 }}>
              {t('builtins.lobe-task.run.continueTopic')}
            </span>
          </>
        )}
        {prompt && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.promptChip}>{prompt}</span>
          </>
        )}
      </div>
    );
  },
);

RunTaskInspector.displayName = 'RunTaskInspector';

export default RunTaskInspector;
