'use client';

import {
  highlightTextStyles,
  inspectorTextStyles,
  shinyTextStyles,
} from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type CodexWebSearchArgs, getWebSearchQuery } from './webSearchUtils';

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

const WebSearchInspector = memo<BuiltinInspectorProps<CodexWebSearchArgs, CodexWebSearchArgs>>(
  ({ args, partialArgs, pluginState, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t('builtins.codex.apiName.web_search', { defaultValue: 'Search the web' });
    const query =
      getWebSearchQuery(args) || getWebSearchQuery(partialArgs) || getWebSearchQuery(pluginState);

    if (isArgumentsStreaming && !query) {
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
        {query && (
          <>
            <span>: </span>
            <span className={highlightTextStyles.primary}>{query}</span>
          </>
        )}
      </div>
    );
  },
);

WebSearchInspector.displayName = 'CodexWebSearchInspector';

export default WebSearchInspector;
