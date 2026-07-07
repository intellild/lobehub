'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { SearchSkillParams, SearchSkillState } from '../../../types';

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

export const SearchSkillInspector = memo<
  BuiltinInspectorProps<SearchSkillParams, SearchSkillState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const query = args?.q || partialArgs?.q || '';
  const resultCount = pluginState?.items?.length ?? 0;
  const total = pluginState?.total ?? resultCount;
  const hasResults = resultCount > 0;

  if (isArgumentsStreaming && !query) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-skill-store.apiName.searchSkill')}</span>
      </div>
    );
  }

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>
        {t('builtins.lobe-skill-store.apiName.searchSkill')}:{'\u00A0'}
      </span>
      {query && <span className={highlightTextStyles.primary}>{query}</span>}
      {!isLoading &&
        !isArgumentsStreaming &&
        pluginState &&
        (hasResults ? (
          <span style={{ marginInlineStart: 4 }}>({total})</span>
        ) : (
          <Text
            as={'span'}
            color={'var(--ant-color-text-description)'}
            fontSize={12}
            style={{ marginInlineStart: 4 }}
          >
            ({t('builtins.lobe-skill-store.inspector.noResults')})
          </Text>
        ))}
    </div>
  );
});

SearchSkillInspector.displayName = 'SearchSkillInspector';
