'use client';

import type { GitFileDiffStatus } from '@lobechat/electron-client-ipc';
import { nanoid } from '@lobechat/utils';
import { ActionIcon, copyToClipboard, Flexbox, PatchDiff } from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import { CopyIcon, LocateFixedIcon, Undo2Icon } from 'lucide-react';
import path from 'path-browserify-esm';
import { memo, type MouseEvent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { message } from '@/components/AntdStaticMethods';
import { gitService } from '@/services/git';
import { useFileStore } from '@/store/file';
import { useGlobalStore } from '@/store/global';

import type { DiffSelectedLineRange } from './selection';
import styles from './FileItem.module.css';
import { buildCodeContextSelection } from './selection';

const reviewDiffUnsafeCSS = `
  :host {
    --diffs-dark-bg: transparent !important;
    --diffs-light-bg: transparent !important;
    --diffs-gap-fallback: 8px;
    --diffs-added-light: var(--ant-color-success-hover);
    --diffs-added-dark: var(--ant-color-success-border-hover);
    --diffs-modified-light: var(--ant-color-info-hover);
    --diffs-modified-dark: var(--ant-color-info-border-hover);
    --diffs-deleted-light: var(--ant-color-error-hover);
    --diffs-deleted-dark: var(--ant-color-error-border-hover);
  }

  [data-gutter-buffer] {
    opacity: 0.2 !important;
  }

  [data-code] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  [data-gutter] {
    backdrop-filter: blur(16px) !important;
  }

  [data-utility-button] {
    width: 16px !important;
    min-width: 16px !important;
    height: 16px !important;
    margin-right: calc(1ch - 8px) !important;
    border: 1px solid var(--ant-color-border-secondary) !important;
    border-radius: 50% !important;
    background: var(--ant-color-bg-container) !important;
    color: var(--ant-color-text-secondary) !important;
    box-shadow: 0 2px 8px var(--ant-color-fill-secondary) !important;
  }

  [data-utility-button]:hover {
    border-color: var(--ant-color-primary) !important;
    background: var(--ant-color-primary-bg) !important;
    color: var(--ant-color-primary) !important;
  }

  [data-utility-button] [data-icon] {
    width: 10px !important;
    height: 10px !important;
  }
`;

interface FileItemHeaderProps {
  additions: number;
  deletions: number;
  filePath: string;
  /** Hide the leading directory portion — used in tree layout where the
   * containing folders are already shown by the tree, so the row only needs
   * the bare filename. */
  hideDir?: boolean;
  /** Called after a successful revert so the parent can refresh the patch list. */
  onReverted?: () => void;
  /** When provided, enables the per-file revert button (unstaged mode only). */
  revertContext?: { deviceId?: string; workingDirectory: string };
  // Status reserved for future use (e.g. dim deleted entries) — keep on the
  // shape so the parent doesn't need to re-derive it later.
  status: GitFileDiffStatus;
}

export const FileItemHeader = memo<FileItemHeaderProps>(
  ({ filePath, additions, deletions, hideDir, revertContext, onReverted }) => {
    const { t } = useTranslation('chat');
    const revealInFilesTab = useGlobalStore((s) => s.revealInFilesTab);

    const lastSlash = filePath.lastIndexOf('/');
    const dir = lastSlash >= 0 ? filePath.slice(0, lastSlash + 1) : '';
    const fileName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;

    const handleCopy = useCallback(
      async (event: MouseEvent<HTMLDivElement>) => {
        // Stop propagation so the row doesn't toggle expand on copy click.
        event.stopPropagation();
        await copyToClipboard(filePath);
        message.success(t('workingPanel.review.copied'));
      },
      [filePath, t],
    );

    const handleReveal = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        revealInFilesTab(filePath);
      },
      [filePath, revealInFilesTab],
    );

    const handleRevert = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!revertContext) return;
        confirmModal({
          cancelText: t('workingPanel.review.revert.confirm.cancel'),
          content: t('workingPanel.review.revert.confirm.description'),
          okButtonProps: { danger: true },
          okText: t('workingPanel.review.revert.confirm.ok'),
          onOk: async () => {
            try {
              const result = await gitService.revertGitFile({
                deviceId: revertContext.deviceId,
                filePath,
                path: revertContext.workingDirectory,
              });
              if (result.success) {
                message.success(t('workingPanel.review.revert.success', { fileName }));
                onReverted?.();
              } else {
                message.error(
                  t('workingPanel.review.revert.failed', {
                    error: result.error || 'unknown error',
                  }),
                );
              }
            } catch (error: any) {
              message.error(
                t('workingPanel.review.revert.failed', {
                  error: error?.message || String(error),
                }),
              );
            }
          },
          title: t('workingPanel.review.revert.confirm.title'),
        });
      },
      [fileName, filePath, onReverted, revertContext, t],
    );

    return (
      <div className={styles.header}>
        <span className={styles.pathWrapper} title={filePath}>
          {!hideDir && dir && (
            // bdi keeps the dir's visual order LTR while the span is
            // direction: rtl for head-side truncation of leading segments.
            <span className={styles.dir}>
              <bdi dir={'ltr'}>{dir}</bdi>
            </span>
          )}
          <span className={styles.fileName}>{fileName}</span>
        </span>
        <span className={styles.stats}>
          {additions > 0 && <span className={styles.additions}>+{additions}</span>}
          {additions > 0 && deletions > 0 && ' '}
          {deletions > 0 && <span className={styles.deletions}>-{deletions}</span>}
        </span>
        <Flexbox horizontal align={'center'} className={styles.actions} gap={2}>
          <ActionIcon
            className={styles.rowAction}
            icon={CopyIcon}
            size={'small'}
            title={t('workingPanel.review.copyPath')}
            onClick={handleCopy}
          />
          <ActionIcon
            className={styles.rowAction}
            data-testid="reveal-in-tree"
            icon={LocateFixedIcon}
            size={'small'}
            title={t('workingPanel.review.revealInTree')}
            onClick={handleReveal}
          />
          {revertContext && (
            <ActionIcon
              className={`${styles.rowAction} ${styles.revertDanger}`}
              icon={Undo2Icon}
              size={'small'}
              title={t('workingPanel.review.revert')}
              onClick={handleRevert}
            />
          )}
        </Flexbox>
      </div>
    );
  },
);

FileItemHeader.displayName = 'ReviewFileItemHeader';

interface FileItemBodyProps {
  /** Whether the Collapse panel is expanded — gates the heavy PatchDiff render. */
  expanded: boolean;
  filePath: string;
  isBinary: boolean;
  patch: string;
  /** Inline word-level diff highlighting; off → plain line-level. */
  textDiff: boolean;
  truncated: boolean;
  viewMode: 'unified' | 'split';
  wordWrap: boolean;
  workingDirectory: string;
}

const FileItemBody = memo<FileItemBodyProps>(
  ({
    filePath,
    patch,
    isBinary,
    truncated,
    expanded,
    viewMode,
    workingDirectory,
    wordWrap,
    textDiff,
  }) => {
    const { t } = useTranslation('chat');
    const addChatContextSelection = useFileStore((s) => s.addChatContextSelection);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const language = ext || undefined;

    const diffOptions = useMemo(
      () => ({
        enableGutterUtility: true,
        enableLineSelection: true,
        lineDiffType: textDiff ? ('word-alt' as const) : ('none' as const),
        onGutterUtilityClick: (range: DiffSelectedLineRange) => {
          const selection = buildCodeContextSelection({
            filePath,
            language,
            patch,
            range,
            workingDirectory,
          });

          if (!selection) return;

          addChatContextSelection({
            ...selection,
            id: `code-selection-${nanoid(6)}`,
            type: 'text',
          });
          message.success(t('workingPanel.review.addSelectionToContext.success'));
        },
        overflow: wordWrap ? ('wrap' as const) : ('scroll' as const),
        unsafeCSS: reviewDiffUnsafeCSS,
      }),
      [addChatContextSelection, filePath, language, patch, t, textDiff, wordWrap, workingDirectory],
    );

    if (!expanded) return null;

    if (isBinary) return <div className={styles.empty}>{t('workingPanel.review.binary')}</div>;
    if (truncated) return <div className={styles.empty}>{t('workingPanel.review.tooLarge')}</div>;
    if (!patch) return <div className={styles.empty}>{t('workingPanel.review.error')}</div>;

    return (
      <PatchDiff
        diffOptions={diffOptions}
        fileName={fileName}
        language={language}
        patch={patch}
        showHeader={false}
        variant={'borderless'}
        viewMode={viewMode}
      />
    );
  },
);

FileItemBody.displayName = 'ReviewFileItemBody';

export default FileItemBody;
