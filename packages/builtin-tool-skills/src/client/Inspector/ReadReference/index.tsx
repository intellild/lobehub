'use client';

import { type BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ReadReferenceParams, ReadReferenceState } from '../../../types';

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

export const ReadReferenceInspector = memo<
  BuiltinInspectorProps<ReadReferenceParams, ReadReferenceState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');

  const path = args?.path || partialArgs?.path || '';
  const resolvedPath = path;

  if (isArgumentsStreaming) {
    if (!path)
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-skills.apiName.readReference')}</span>
        </div>
      );

    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-skills.apiName.readReference')}:</span>
        <span>{path}</span>
      </div>
    );
  }

  return (
    <div className={cx(inspectorTextStyles.root, isLoading && shinyTextStyles.shinyText)}>
      <span className={inspectorTextStyles.root}>
        <span>{t('builtins.lobe-skills.apiName.readReference')}:</span>
        <span className={highlightTextStyles.primary}>{resolvedPath}</span>
      </span>
    </div>
  );
});

ReadReferenceInspector.displayName = 'ReadReferenceInspector';
