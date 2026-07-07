'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type AskUserQuestionArgs, ClaudeCodeApiName } from '../../types';
import styles from './AskUserQuestion.module.css';

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

export const AskUserQuestionInspector = memo<BuiltinInspectorProps<AskUserQuestionArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t(ClaudeCodeApiName.AskUserQuestion as any);
    const questions = args?.questions ?? partialArgs?.questions ?? [];
    const summary =
      questions.length === 0
        ? undefined
        : questions.length === 1
          ? questions[0]?.header || questions[0]?.question
          : `${questions[0]?.header || questions[0]?.question} +${questions.length - 1}`;

    if (isArgumentsStreaming && !summary) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    return (
      <div
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span>{label}</span>
        {summary && <span className={styles.chip}>{summary}</span>}
      </div>
    );
  },
);

AskUserQuestionInspector.displayName = 'ClaudeCodeAskUserQuestionInspector';
