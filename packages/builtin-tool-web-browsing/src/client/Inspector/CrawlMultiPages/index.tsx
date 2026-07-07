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

interface CrawlMultiPagesParams {
  urls: string[];
}

export const CrawlMultiPagesInspector = memo<BuiltinInspectorProps<CrawlMultiPagesParams>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const urls = args?.urls || partialArgs?.urls;

    // Show count and first domain for context
    let displayText = '';
    if (urls && urls.length > 0) {
      const count = urls.length;
      try {
        const firstUrl = new URL(urls[0]);
        displayText = count > 1 ? `${firstUrl.hostname} +${count - 1}` : firstUrl.hostname;
      } catch {
        displayText = `${count} pages`;
      }
    }

    if (isArgumentsStreaming && !displayText) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-web-browsing.apiName.crawlMultiPages')}</span>
        </div>
      );
    }

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        <span>
          {t('builtins.lobe-web-browsing.apiName.crawlMultiPages')}:{'\u00A0'}
        </span>
        {displayText && <span className={highlightTextStyles.gold}>{displayText}</span>}
      </div>
    );
  },
);

CrawlMultiPagesInspector.displayName = 'CrawlMultiPagesInspector';

export default CrawlMultiPagesInspector;
