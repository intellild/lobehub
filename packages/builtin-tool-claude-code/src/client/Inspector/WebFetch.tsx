'use client';

import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Globe } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ClaudeCodeApiName, type WebFetchArgs } from '../../types';
import styles from './WebFetch.module.css';

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

/**
 * Strip the protocol so the chip leads with the host — full URLs eat the
 * width quickly and the `https://` prefix is noise.
 */
const stripProtocol = (url: string): string => url.replace(/^https?:\/\//i, '');

export const WebFetchInspector = memo<BuiltinInspectorProps<WebFetchArgs>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading }) => {
    const { t } = useTranslation('plugin');
    const label = t(ClaudeCodeApiName.WebFetch as any);
    const url = (args?.url || partialArgs?.url || '').trim();

    if (isArgumentsStreaming && !url) {
      return <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{label}</div>;
    }

    const isShiny = isArgumentsStreaming || isLoading;

    return (
      <div className={cx(inspectorTextStyles.root, isShiny && shinyTextStyles.shinyText)}>
        <span>{url ? `${label}:` : label}</span>
        {url && (
          <span className={styles.chip}>
            <Globe className={styles.icon} size={14} />
            <span className={styles.url}>{stripProtocol(url)}</span>
          </span>
        )}
      </div>
    );
  },
);

WebFetchInspector.displayName = 'ClaudeCodeWebFetchInspector';
