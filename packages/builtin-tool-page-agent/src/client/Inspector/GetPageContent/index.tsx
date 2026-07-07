'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { oneLineEllipsis, shinyTextStyles } from '@/styles';

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

export const GetPageContentInspector = memo<BuiltinInspectorProps>(({ isArgumentsStreaming }) => {
  const { t } = useTranslation('plugin');

  return (
    <div
      className={cx(
        oneLineEllipsis,
        isArgumentsStreaming ? shinyTextStyles.shinyText : styles.done,
      )}
    >
      <span>{t('builtins.lobe-page-agent.apiName.getPageContent')}</span>
    </div>
  );
});

GetPageContentInspector.displayName = 'GetPageContentInspector';

export default GetPageContentInspector;
