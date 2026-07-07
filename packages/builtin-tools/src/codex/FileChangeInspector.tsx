'use client';

import { FilePathDisplay } from '@lobechat/shared-tool-ui/components';
import { inspectorTextStyles, shinyTextStyles } from '@lobechat/shared-tool-ui/styles';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './FileChangeInspector.module.css';
import { type CodexFileChangeArgs, type CodexFileChangeState, getFileChangeStats } from './utils';

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

const FileChangeInspector = memo<BuiltinInspectorProps<CodexFileChangeArgs, CodexFileChangeState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
    const { t } = useTranslation('plugin');
    const stats = getFileChangeStats(args || partialArgs, pluginState);
    const hasLineStats = stats.linesAdded > 0 || stats.linesDeleted > 0;
    const isEditing = isArgumentsStreaming || isLoading;
    const summary = isEditing
      ? t('builtins.codex.fileChange.editing', { defaultValue: 'Editing files' })
      : stats.total > 0
        ? t('builtins.codex.fileChange.editedFiles', {
            count: stats.total,
            defaultValue: stats.total === 1 ? 'Edited {{count}} file' : 'Edited {{count}} files',
          })
        : t('builtins.codex.fileChange.noChanges', { defaultValue: 'No file changes' });

    if (isEditing && !stats.firstPath) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>{summary}</div>
      );
    }

    return (
      <div className={cx(inspectorTextStyles.root, isEditing && shinyTextStyles.shinyText)}>
        {stats.firstPath ? (
          <>
            <span className={styles.summary}>{summary}:</span>
            <FilePathDisplay filePath={stats.firstPath} />
          </>
        ) : (
          <span>{summary}</span>
        )}
        {stats.total > 1 && <span className={styles.count}>+{stats.total - 1}</span>}
        {hasLineStats && (
          <>
            <span className={styles.lineAdded}>+{stats.linesAdded}</span>
            <span className={styles.lineDeleted}>-{stats.linesDeleted}</span>
          </>
        )}
      </div>
    );
  },
);

FileChangeInspector.displayName = 'CodexFileChangeInspector';

export default FileChangeInspector;
