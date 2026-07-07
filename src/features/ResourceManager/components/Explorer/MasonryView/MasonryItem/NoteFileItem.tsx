import { Button, stopPropagation, Tooltip } from '@lobehub/ui';
import { isNull } from 'es-toolkit/compat';
import { FileBoxIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { fileManagerSelectors, useFileStore } from '@/store/file';
import { type AsyncTaskStatus, type IAsyncTaskError } from '@/types/asyncTask';
import { isChunkingUnsupported } from '@/utils/isChunkingUnsupported';
import markdownToTxt from '@/utils/markdownToTxt';

import ChunksBadge from '../../ListView/ListItem/ChunkTag';
import styles from './NoteFileItem.module.css';

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

// Helper to extract title from markdown content
const extractTitle = (content: string): string | null => {
  if (!content) return null;

  // Find first markdown header (# title)
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
};

// Helper to extract preview text from note content
const getPreviewText = (content: string): string => {
  if (!content) return '';

  // Convert markdown to plain text
  let plainText = markdownToTxt(content);

  // Remove the title line if it exists
  const title = extractTitle(content);
  if (title) {
    plainText = plainText.replace(title, '').trim();
  }

  // Limit to first 400 characters for preview
  return plainText.slice(0, 400);
};

interface NoteFileItemProps {
  chunkCount?: number | null;
  chunkingError?: IAsyncTaskError | null;
  chunkingStatus?: AsyncTaskStatus | null;
  embeddingError?: IAsyncTaskError | null;
  embeddingStatus?: AsyncTaskStatus | null;
  fileType?: string;
  finishEmbedding?: boolean;
  id: string;
  isLoadingMarkdown: boolean;
  markdownContent: string;
  metadata?: Record<string, any> | null;
  name: string;
}

const NoteFileItem = memo<NoteFileItemProps>(
  ({
    chunkCount,
    chunkingError,
    chunkingStatus,
    embeddingError,
    embeddingStatus,
    fileType,
    finishEmbedding,
    id,
    isLoadingMarkdown,
    markdownContent,
    name,
    metadata,
  }) => {
    const { t } = useTranslation(['components', 'file']);
    const [isCreatingFileParseTask, parseFiles] = useFileStore((s) => [
      fileManagerSelectors.isCreatingFileParseTask(id)(s),
      s.parseFilesToChunks,
    ]);

    const isSupportedForChunking = !isChunkingUnsupported(fileType || '');

    const extractedTitle = markdownContent ? extractTitle(markdownContent) : null;
    const displayTitle = extractedTitle || name || t('file:pageList.untitled');
    const emoji = metadata?.emoji;
    const previewText = markdownContent ? getPreviewText(markdownContent) : '';

    return (
      <>
        <div style={{ position: 'relative' }}>
          {isLoadingMarkdown ? (
            <div className={styles.markdownLoading}>Loading preview...</div>
          ) : markdownContent ? (
            <div className={styles.noteContent}>
              <div className={styles.noteTitle}>
                {emoji && <span style={{ fontSize: 20 }}>{emoji}</span>}
                <span>{displayTitle}</span>
              </div>
              {previewText ? (
                <div className={styles.notePreview}>{previewText}</div>
              ) : (
                <div className={styles.notePreview}>
                  <span style={{ color: 'var(--lobe-text-tertiary)', fontStyle: 'italic' }}>
                    No content
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noteContent}>
              <div className={styles.noteTitle}>
                {emoji && <span style={{ fontSize: 20 }}>{emoji}</span>}
                <span>{displayTitle}</span>
              </div>
              <div className={styles.notePreview}>
                <span style={{ color: 'var(--lobe-text-tertiary)', fontStyle: 'italic' }}>
                  No content
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Floating chunk badge or action button */}
        {!isNull(chunkingStatus) && chunkingStatus ? (
          <div
            className={cx('floatingChunkBadge', styles.floatingChunkBadge)}
            onClick={stopPropagation}
          >
            <ChunksBadge
              chunkCount={chunkCount}
              chunkingError={chunkingError}
              chunkingStatus={chunkingStatus}
              embeddingError={embeddingError}
              embeddingStatus={embeddingStatus}
              finishEmbedding={finishEmbedding}
              id={id}
            />
          </div>
        ) : (
          isSupportedForChunking && (
            <Tooltip title={t('FileManager.actions.chunkingTooltip')}>
              <div
                className={cx('floatingChunkBadge', styles.floatingChunkBadge)}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCreatingFileParseTask) {
                    parseFiles([id]);
                  }
                }}
              >
                <Button
                  icon={FileBoxIcon}
                  loading={isCreatingFileParseTask}
                  size={'small'}
                  type={'text'}
                />
              </div>
            </Tooltip>
          )
        )}
      </>
    );
  },
);

export default NoteFileItem;
