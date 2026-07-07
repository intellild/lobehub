'use client';

import { type BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox, Icon, Tooltip } from '@lobehub/ui';
import { AlertTriangle } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ActivatedToolInfo, ActivateToolsParams, ActivateToolsState } from '../../../types';
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

export const ActivateToolsInspector = memo<
  BuiltinInspectorProps<ActivateToolsParams, ActivateToolsState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const identifiers = args?.identifiers || partialArgs?.identifiers;
  const activatedTools = pluginState?.activatedTools;
  const notFoundList = pluginState?.notFound ?? [];
  const requestedTools: ActivatedToolInfo[] =
    identifiers?.map((id) => ({ apiCount: 0, identifier: id, name: id })) ?? [];
  const visibleTools =
    activatedTools && activatedTools.length > 0 ? activatedTools : requestedTools;

  // Streaming / Loading: show identifiers from arguments
  if (isArgumentsStreaming || isLoading) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-activator.apiName.activateTools')}</span>
        {identifiers && identifiers.length > 0 && (
          <span className={styles.tools}>
            {identifiers.map((id) => (
              <span className={styles.tool} key={id}>
                <span className={styles.toolName}>{id}</span>
              </span>
            ))}
          </span>
        )}
      </div>
    );
  }

  // Finished: show activated tool names with avatars; surface notFound in the title row
  const hasNotFound = notFoundList.length > 0;
  const notFoundTitle = notFoundList.join(', ');

  return (
    <Flexbox
      allowShrink
      horizontal
      className={inspectorTextStyles.root}
      gap={8}
      style={{ flexWrap: 'wrap' }}
    >
      <span>{t('builtins.lobe-activator.apiName.activateTools')}</span>
      {hasNotFound && (
        <Tooltip title={notFoundTitle}>
          <Flexbox horizontal className={styles.notFoundHint} gap={4}>
            <Icon color={'var(--ant-color-warning)'} icon={AlertTriangle} />
            <span>
              {t('builtins.lobe-activator.inspector.activateTools.notFoundCount', {
                count: notFoundList.length,
              })}
            </span>
          </Flexbox>
        </Tooltip>
      )}
      {visibleTools.length > 0 && (
        <span className={styles.tools}>
          {visibleTools.map((tool) => (
            <span className={styles.tool} key={tool.identifier}>
              {tool.avatar && <Avatar avatar={tool.avatar} size={14} title={tool.name} />}
              <span className={styles.toolName}>{tool.name}</span>
            </span>
          ))}
        </span>
      )}
    </Flexbox>
  );
});

ActivateToolsInspector.displayName = 'ActivateToolsInspector';
