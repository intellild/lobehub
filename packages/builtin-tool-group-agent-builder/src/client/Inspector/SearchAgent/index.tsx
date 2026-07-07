'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { SearchAgentParams, SearchAgentState } from '../../../types';

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

export const SearchAgentInspector = memo<
  BuiltinInspectorProps<SearchAgentParams, SearchAgentState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const query = args?.query || partialArgs?.query;

  // Initial streaming state
  if (isArgumentsStreaming && !query) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.searchAgent')}</span>
      </div>
    );
  }

  const resultCount = pluginState?.total ?? pluginState?.agents?.length ?? 0;
  const hasResults = resultCount > 0;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-group-agent-builder.apiName.searchAgent')}</span>
      {query && (
        <>
          :<span className={highlightTextStyles.primary}>{query}</span>
        </>
      )}
      {!isLoading &&
        !isArgumentsStreaming &&
        pluginState?.agents &&
        (hasResults ? (
          <span style={{ marginInlineStart: 4 }}>({resultCount})</span>
        ) : (
          <Text
            as={'span'}
            color={'var(--ant-color-text-description)'}
            fontSize={12}
            style={{ marginInlineStart: 4 }}
          >
            ({t('builtins.lobe-group-agent-builder.inspector.noResults')})
          </Text>
        ))}
    </div>
  );
});

SearchAgentInspector.displayName = 'SearchAgentInspector';

export default SearchAgentInspector;
