'use client';

import { downloadFile } from '@lobechat/utils/client';
import { FilePlugin, UploadPlugin, useLexicalComposerContext } from '@lobehub/editor';
import { ActionIcon } from '@lobehub/ui';
import { DownloadIcon } from 'lucide-react';
import { type FC, memo, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

import FileIcon from '@/components/FileIcon';
import { formatSize } from '@/utils/format';

import styles from './LinearFilePlugin.module.css';

interface FileNodeLike {
  fileUrl?: string;
  message?: string;
  name: string;
  size?: number;
  status?: 'pending' | 'uploaded' | 'error';
}

interface LinearFileCardProps {
  node: FileNodeLike;
}

export const LinearFileCard = memo<LinearFileCardProps>(({ node }) => {
  const { t } = useTranslation('editor');

  const { fileUrl, message, name, size, status } = node;

  if (status === 'pending') {
    return <div className={styles.state}>{t('file.uploading')}</div>;
  }
  if (status === 'error') {
    return (
      <div className={styles.state}>{t('file.error', { message: message || 'Unknown error' })}</div>
    );
  }

  const onDownloadClick = (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.stopPropagation();
    event.preventDefault();
    if (!fileUrl) return;
    void downloadFile(fileUrl, name);
  };

  return (
    <div className={styles.card}>
      <FileIcon fileName={name} size={36} />
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        {typeof size === 'number' && size > 0 ? (
          <div className={styles.size}>{formatSize(size)}</div>
        ) : null}
      </div>
      <div className={styles.download} data-lobehub-file-download="">
        <ActionIcon
          aria-label="Download"
          icon={DownloadIcon}
          size={'small'}
          variant={'filled'}
          onClick={onDownloadClick}
        />
      </div>
    </div>
  );
});

LinearFileCard.displayName = 'LinearFileCard';

interface LinearFilePluginProps {
  handleUpload: (file: File) => Promise<{ url: string }>;
  /**
   * Class applied to the outer Lexical `<span>` wrapper. Set to a block-level
   * style so the file card claims its own line in the paragraph.
   */
  theme?: { file?: string };
}

const LinearFilePlugin: FC<LinearFilePluginProps> = ({ handleUpload, theme }) => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    editor.registerPlugin(UploadPlugin);
    editor.registerPlugin(FilePlugin, {
      decorator: (node) => <LinearFileCard node={node} />,
      handleUpload,
      theme,
    });
  }, [editor, handleUpload, theme]);

  return null;
};

LinearFilePlugin.displayName = 'LinearFilePlugin';

export default LinearFilePlugin;
