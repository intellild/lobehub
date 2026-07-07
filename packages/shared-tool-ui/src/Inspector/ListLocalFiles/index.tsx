'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FilePathDisplay } from '../../components/FilePathDisplay';
import { inspectorTextStyles, shinyTextStyles } from '../../styles';

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

interface ListFilesArgs {
  directoryPath?: string;
  path?: string;
}

export const createListLocalFilesInspector = (translationKey: string) => {
  const Inspector = memo<BuiltinInspectorProps<ListFilesArgs, any>>(
    ({ args, partialArgs, isArgumentsStreaming, pluginState, isLoading }) => {
      const { t } = useTranslation('plugin');

      const dirPath = args?.path || args?.directoryPath || partialArgs?.path || '';
      const resultCount = pluginState?.totalCount ?? pluginState?.files?.length ?? 0;

      if (isArgumentsStreaming) {
        if (!dirPath)
          return (
            <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
              <span>{t(translationKey as any)}</span>
            </div>
          );

        return (
          <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
            <span style={{ marginInlineEnd: 6 }}>{t(translationKey as any)}:</span>
            <FilePathDisplay isDirectory filePath={dirPath} />
          </div>
        );
      }

      return (
        <div className={cx(inspectorTextStyles.root, isLoading && shinyTextStyles.shinyText)}>
          <span style={{ marginInlineEnd: 6 }}>{t(translationKey as any)}:</span>
          <FilePathDisplay isDirectory filePath={dirPath} />
          {!isLoading && resultCount > 0 && (
            <span style={{ marginInlineStart: 4 }}>({resultCount})</span>
          )}
        </div>
      );
    },
  );
  Inspector.displayName = 'ListLocalFilesInspector';
  return Inspector;
};
