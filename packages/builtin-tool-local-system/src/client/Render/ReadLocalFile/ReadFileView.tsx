import { useToolRenderCapabilities } from '@lobechat/shared-tool-ui';
import type { ReadFileState } from '@lobechat/tool-runtime';
import { ActionIcon, Flexbox, Icon, Markdown, Text } from '@lobehub/ui';
import { AlignLeft, Asterisk, ExternalLink, FolderOpen } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import FileIcon from '@/components/FileIcon';
import { InlineHtmlPreview, isHtmlFile } from '@/components/HtmlPreview';

import styles from './ReadFileView.module.css';

const ReadFileView = memo<ReadFileState>(
  ({
    filename: filenameProp,
    path,
    fileType,
    charCount,
    content,
    totalLines,
    totalCharCount,
    loc,
  }) => {
    const { t } = useTranslation('tool');
    const { openFile, openFolder, displayRelativePath } = useToolRenderCapabilities();
    const filename = filenameProp || path.split('/').pop() || path;
    const isHtml = isHtmlFile({ fileName: filename, fileType, path });

    const handleOpenFile = openFile
      ? (e: React.MouseEvent) => {
          e.stopPropagation();
          openFile(path);
        }
      : undefined;

    const handleOpenFolder = openFolder
      ? (e: React.MouseEvent) => {
          e.stopPropagation();
          openFolder(path);
        }
      : undefined;

    const displayPath = displayRelativePath ? displayRelativePath(path) : path;

    return (
      <Flexbox className={styles.container} gap={12}>
        <Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={styles.header}
            gap={12}
            justify={'space-between'}
          >
            <Flexbox horizontal align={'center'} flex={1} gap={0} style={{ overflow: 'hidden' }}>
              <FileIcon fileName={filename} fileType={fileType} size={16} variant={'raw'} />
              <Flexbox horizontal>
                <Text ellipsis className={styles.fileName}>
                  {filename}
                </Text>
                {(handleOpenFile || handleOpenFolder) && (
                  <Flexbox horizontal className={styles.actions} gap={2} style={{ marginLeft: 8 }}>
                    {handleOpenFile && (
                      <ActionIcon
                        icon={ExternalLink}
                        size="small"
                        title={t('localFiles.openFile')}
                        onClick={handleOpenFile}
                      />
                    )}
                    {handleOpenFolder && (
                      <ActionIcon
                        icon={FolderOpen}
                        size="small"
                        title={t('localFiles.openFolder')}
                        onClick={handleOpenFolder}
                      />
                    )}
                  </Flexbox>
                )}
              </Flexbox>
            </Flexbox>
            <Flexbox horizontal align={'center'} className={styles.meta} gap={16}>
              {charCount !== undefined && (
                <Flexbox horizontal align={'center'} gap={4}>
                  <Icon icon={Asterisk} size={'small'} />
                  <span>
                    {charCount}
                    {totalCharCount !== undefined && (
                      <>
                        {' '}
                        / <span className={styles.lineCount}>{totalCharCount}</span>
                      </>
                    )}
                  </span>
                </Flexbox>
              )}
              {loc && (
                <Flexbox horizontal align={'center'} gap={4}>
                  <Icon icon={AlignLeft} size={'small'} />
                  <span>
                    L{loc[0]}-{loc[1]}
                    {totalLines !== undefined && (
                      <>
                        {' '}
                        / <span className={styles.lineCount}>{totalLines}</span>
                      </>
                    )}
                  </span>
                </Flexbox>
              )}
            </Flexbox>
          </Flexbox>

          <Text ellipsis className={styles.path} type={'secondary'}>
            {displayPath}
          </Text>
        </Flexbox>

        <Flexbox
          className={styles.previewBox}
          style={{ height: isHtml ? 240 : undefined, maxHeight: 240 }}
        >
          {isHtml ? (
            <InlineHtmlPreview content={content} />
          ) : fileType === 'md' ? (
            <Markdown style={{ overflow: 'auto' }}>{content}</Markdown>
          ) : (
            <div className={styles.previewText} style={{ width: '100%' }}>
              {content}
            </div>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

export default ReadFileView;
