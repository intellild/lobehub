'use client';

import type { GrepContentState } from '@lobechat/tool-runtime';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Text } from '@lobehub/ui';
import { Fragment, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '../../styles';
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

const splitPattern = (pattern: string): string[] =>
  pattern
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

const PatternTags = memo<{ pattern: string }>(({ pattern }) => {
  const parts = splitPattern(pattern);
  if (parts.length === 0) return null;

  return (
    <span className={styles.tagsList}>
      {parts.map((part, index) => (
        <Fragment key={`${index}-${part}`}>
          {index > 0 && <span className={styles.separator}>|</span>}
          <span className={styles.tag}>{part}</span>
        </Fragment>
      ))}
    </span>
  );
});
PatternTags.displayName = 'GrepPatternTags';

interface GrepContentArgs {
  directory?: string;
  path?: string;
  pattern?: string;
}

interface CreateGrepContentInspectorOptions {
  noResultsKey: string;
  translationKey: string;
}

export const createGrepContentInspector = ({
  translationKey,
  noResultsKey,
}: CreateGrepContentInspectorOptions) => {
  const Inspector = memo<BuiltinInspectorProps<GrepContentArgs, GrepContentState>>(
    ({ args, partialArgs, isArgumentsStreaming, pluginState, isLoading }) => {
      const { t } = useTranslation('plugin');

      const pattern = args?.pattern || partialArgs?.pattern || '';

      if (isArgumentsStreaming) {
        if (!pattern)
          return (
            <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
              <span>{t(translationKey as any)}</span>
            </div>
          );

        return (
          <div className={cx(inspectorTextStyles.root, styles.baseline, shinyTextStyles.shinyText)}>
            <span>{t(translationKey as any)}:</span>
            <PatternTags pattern={pattern} />
          </div>
        );
      }

      const resultCount = pluginState?.totalMatches ?? 0;
      const hasResults = resultCount > 0;

      return (
        <div
          className={cx(
            inspectorTextStyles.root,
            styles.baseline,
            isLoading && shinyTextStyles.shinyText,
          )}
        >
          <span>{t(translationKey as any)}:</span>
          {pattern && <PatternTags pattern={pattern} />}
          {!isLoading &&
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
                ({t(noResultsKey as any)})
              </Text>
            ))}
        </div>
      );
    },
  );
  Inspector.displayName = 'GrepContentInspector';
  return Inspector;
};
