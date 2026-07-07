'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { WebOnboardingDocumentType } from '../../../types';
import { inspectorChipStyles } from '../_styles';

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

interface ReadDocumentArgs {
  type?: WebOnboardingDocumentType;
}

export const ReadDocumentInspector = memo<
  BuiltinInspectorProps<ReadDocumentArgs, Record<string, unknown>>
>(({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
  const { t } = useTranslation('plugin');
  const styles = inspectorChipStyles;

  const type = args?.type ?? partialArgs?.type;

  if (isArgumentsStreaming && !type) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-web-onboarding.apiName.readDocument')}</span>
      </div>
    );
  }

  return (
    <div
      style={{ gap: 4 }}
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-web-onboarding.apiName.readDocument')}</span>
      {type && (
        <span className={styles.chip}>
          {t(`builtins.lobe-web-onboarding.docType.${type}` as const)}
        </span>
      )}
    </div>
  );
});

ReadDocumentInspector.displayName = 'ReadDocumentInspector';

export default ReadDocumentInspector;
