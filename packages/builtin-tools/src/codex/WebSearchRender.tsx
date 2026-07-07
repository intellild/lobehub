'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './WebSearchRender.module.css';
import {
  type CodexWebSearchArgs,
  getWebSearchOutput,
  getWebSearchQuery,
  getWebSearchResults,
} from './webSearchUtils';

const WebSearchRender = memo<BuiltinRenderProps<CodexWebSearchArgs, CodexWebSearchArgs>>(
  ({ args, content, pluginState }) => {
    const { t } = useTranslation('plugin');
    const query = getWebSearchQuery(args) || getWebSearchQuery(pluginState);
    const argResults = getWebSearchResults(args, content);
    const results = argResults.length > 0 ? argResults : getWebSearchResults(pluginState);
    const output = results.length > 0 ? '' : getWebSearchOutput(content);

    if (!query && results.length === 0 && !output) return null;

    return (
      <Flexbox className={styles.root}>
        {query && (
          <Flexbox horizontal className={styles.queryRow}>
            <span className={styles.queryLabel}>
              {t('builtins.codex.webSearch.query', { defaultValue: 'Query' })}
            </span>
            <span className={styles.query}>{query}</span>
          </Flexbox>
        )}
        {results.length > 0 && (
          <Flexbox className={styles.resultList}>
            {results.map((result, index) => {
              const key = result.url || `${result.title}-${index}`;
              const title = <span className={styles.title}>{result.title}</span>;

              return (
                <Flexbox className={styles.resultItem} gap={3} key={key}>
                  {result.url ? (
                    <a href={result.url} rel={'noreferrer'} target={'_blank'}>
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                  {result.url && <Text className={styles.url}>{result.url}</Text>}
                  {result.snippet && <Text className={styles.snippet}>{result.snippet}</Text>}
                </Flexbox>
              );
            })}
          </Flexbox>
        )}
        {output && <pre className={styles.output}>{output}</pre>}
      </Flexbox>
    );
  },
);

WebSearchRender.displayName = 'CodexWebSearchRender';

export default WebSearchRender;
