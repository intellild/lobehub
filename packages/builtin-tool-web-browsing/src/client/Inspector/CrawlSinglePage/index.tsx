'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

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

interface CrawlSinglePageParams {
  url: string;
}

export const CrawlSinglePageInspector = memo<BuiltinInspectorProps<CrawlSinglePageParams>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const url = args?.url || partialArgs?.url;

    if (isArgumentsStreaming && !url) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-web-browsing.apiName.crawlSinglePage')}</span>
        </div>
      );
    }

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        <span>
          {t('builtins.lobe-web-browsing.apiName.crawlSinglePage')}:{'\u00A0'}
        </span>
        {url && <span className={highlightTextStyles.gold}>{url}</span>}
      </div>
    );
  },
);

CrawlSinglePageInspector.displayName = 'CrawlSinglePageInspector';

export default CrawlSinglePageInspector;
