import type { ChatContextContent } from '@lobechat/types';
import { Tag, Tooltip } from '@lobehub/ui';
import { Code2Icon, TextIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

import { useFileStore } from '@/store/file';

import styles from './SelectionItem.module.css';

const MAX_PREVIEW_LENGTH = 8;
const MAX_CODE_PREVIEW_LINES = 8;

const getPreviewText = (content?: string, fallback?: string) => {
  const source = content || fallback || '';
  if (!source) return 'Text selection';

  const plain = source
    .replaceAll(/<[^>]*>/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
  if (!plain) return 'Text selection';

  return plain.length > MAX_PREVIEW_LENGTH ? `${plain.slice(0, MAX_PREVIEW_LENGTH)}...` : plain;
};

const getLocationText = ({
  filePath,
  lineRange,
  title,
}: Pick<ChatContextContent, 'filePath' | 'lineRange' | 'title'>) => {
  const location = filePath || title;
  if (!location) return;

  if (!lineRange) return location;

  const endLine = lineRange.endLine ?? lineRange.startLine;
  return `${location}:${lineRange.startLine}-${endLine}`;
};

const SelectionItem = memo<ChatContextContent>(
  ({ content, filePath, id, lineRange, preview, source, title }) => {
    const [removeSelection] = useFileStore((s) => [s.removeChatContextSelection]);

    const displayText = useMemo(
      () => getPreviewText(preview || getLocationText({ filePath, lineRange, title }), content),
      [content, filePath, lineRange, preview, title],
    );
    const isCodeSelection = source === 'code' || Boolean(filePath);

    const tooltip = useMemo(() => {
      if (!isCodeSelection) {
        return <div className={styles.textPreview}>{preview || content}</div>;
      }

      const lines = content.split('\n');
      const previewLines = lines.slice(0, MAX_CODE_PREVIEW_LINES);
      const startLine = lineRange?.startLine ?? 1;

      return (
        <div>
          <div className={styles.meta}>
            {getLocationText({ filePath, lineRange, title }) || preview || title}
          </div>
          <pre className={styles.codePreview}>
            {previewLines.map((line, index) => (
              <div className={styles.codeLine} key={`${index}-${line}`}>
                <span className={styles.lineNumber}>{startLine + index}</span>
                <code className={styles.content}>{line || ' '}</code>
              </div>
            ))}
            {lines.length > MAX_CODE_PREVIEW_LINES && (
              <div className={`${styles.codeLine} ${styles.truncated}`}>
                <span className={styles.lineNumber}>...</span>
                <code className={styles.content}>...</code>
              </div>
            )}
          </pre>
        </div>
      );
    }, [content, filePath, isCodeSelection, lineRange, preview, title]);

    return (
      <Tag
        closable
        icon={isCodeSelection ? <Code2Icon size={16} /> : <TextIcon size={16} />}
        size={'large'}
        onClose={() => removeSelection(id)}
      >
        <Tooltip title={tooltip}>
          <span className={styles.name}>{displayText}</span>
        </Tooltip>
      </Tag>
    );
  },
);

SelectionItem.displayName = 'SelectionItem';

export default SelectionItem;
