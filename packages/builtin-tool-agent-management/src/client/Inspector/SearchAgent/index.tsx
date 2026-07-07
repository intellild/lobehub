'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, shinyTextStyles } from '@/styles';

import type { SearchAgentParams, SearchAgentSource } from '../../../types';
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

const getSourceTitleKey = (source: SearchAgentSource = 'all') => {
  switch (source) {
    case 'user': {
      return 'builtins.lobe-agent-management.inspector.searchAgent.user';
    }
    case 'market': {
      return 'builtins.lobe-agent-management.inspector.searchAgent.market';
    }
    default: {
      return 'builtins.lobe-agent-management.inspector.searchAgent.all';
    }
  }
};

export const SearchAgentInspector = memo<BuiltinInspectorProps<SearchAgentParams>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const keyword = args?.keyword || partialArgs?.keyword;
    const source = args?.source || partialArgs?.source || 'all';

    const titleKey = useMemo(() => getSourceTitleKey(source), [source]);

    if (isArgumentsStreaming && !keyword) {
      return (
        <div className={cx(styles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-agent-management.apiName.searchAgent')}</span>
        </div>
      );
    }

    return (
      <Flexbox
        horizontal
        align={'center'}
        className={cx(styles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
        gap={8}
      >
        <span className={styles.title}>{t(titleKey)}</span>
        {keyword && <span className={highlightTextStyles.primary}>{keyword}</span>}
      </Flexbox>
    );
  },
);

SearchAgentInspector.displayName = 'SearchAgentInspector';

export default SearchAgentInspector;
