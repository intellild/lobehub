'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { SearchMemoryParams, SearchUserMemoryState } from '../../../types';

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

export const SearchUserMemoryInspector = memo<
  BuiltinInspectorProps<SearchMemoryParams, SearchUserMemoryState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  // `queries` comes from raw model tool-call args; a model may emit a scalar where
  // `string[]` is expected, so `.join` guards against a non-array crashing render.
  const joinQueries = (queries: unknown) => (Array.isArray(queries) ? queries.join(', ') : '');
  const query = joinQueries(args?.queries) || joinQueries(partialArgs?.queries);

  // Initial streaming state
  if (isArgumentsStreaming && !query) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-user-memory.apiName.searchUserMemory')}</span>
      </div>
    );
  }

  // pluginState is SearchMemoryResult directly.
  const resultCount = pluginState
    ? (pluginState.activities?.length ?? 0) +
      (pluginState.contexts?.length ?? 0) +
      (pluginState.experiences?.length ?? 0) +
      (pluginState.identities?.length ?? 0) +
      (pluginState.preferences?.length ?? 0)
    : 0;
  const hasResults = resultCount > 0;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-user-memory.apiName.searchUserMemory')}: </span>
      {query && <span className={highlightTextStyles.primary}>{query}</span>}
      {!isLoading &&
        !isArgumentsStreaming &&
        pluginState &&
        (hasResults ? (
          <span style={{ marginInlineStart: 4 }}>({resultCount})</span>
        ) : (
          <Text
            as={'span'}
            color={'var(--ant-color-text-description)'}
            fontSize={12}
            style={{ marginInlineStart: 4 }}
          >
            ({t('builtins.lobe-user-memory.inspector.noResults')})
          </Text>
        ))}
    </div>
  );
});

SearchUserMemoryInspector.displayName = 'SearchUserMemoryInspector';

export default SearchUserMemoryInspector;
