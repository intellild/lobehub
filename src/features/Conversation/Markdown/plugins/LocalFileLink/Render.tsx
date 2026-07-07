'use client';

import { isDesktop } from '@lobechat/const';
import { A, Tooltip } from '@lobehub/ui';
import type { MouseEvent } from 'react';
import { memo, useCallback } from 'react';

import FileIcon from '@/components/FileIcon';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat/selectors';

import type { MarkdownElementProps } from '../type';
import type { ParsedLocalFileHref } from './parse';
import { parseLocalFileHref } from './parse';
import styles from './Render.module.css';

interface LocalFileLinkProperties {
  linkHref?: string;
  linkLabel?: string;
}

const getFileName = (filePath: string) => filePath.split(/[\\/]/).at(-1) || filePath;

const formatLocalFileTitle = ({ column, filePath, line }: ParsedLocalFileHref) => {
  if (!line) return filePath;

  return column ? `${filePath} (line ${line}, column ${column})` : `${filePath} (line ${line})`;
};

const Render = memo<MarkdownElementProps<LocalFileLinkProperties>>(({ node }) => {
  const { linkHref, linkLabel } = node?.properties || {};
  const openLocalFile = useChatStore((s) => s.openLocalFile);
  const workingDirectory = useChatStore(topicSelectors.currentTopicWorkingDirectory);
  const parsed = isDesktop ? parseLocalFileHref(linkHref, { workingDirectory }) : null;
  const allowExternalFilePreview =
    !!parsed && (!workingDirectory || parsed.workingDirectory !== workingDirectory);
  const label = linkLabel || parsed?.filePath || linkHref || '';
  const iconFileName = parsed ? getFileName(parsed.filePath) : label;
  const title = parsed ? formatLocalFileTitle(parsed) : linkHref;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!parsed) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      openLocalFile({
        allowExternalFilePreview,
        filePath: parsed.filePath,
        workingDirectory: parsed.workingDirectory,
      });
    },
    [allowExternalFilePreview, openLocalFile, parsed],
  );

  return (
    <Tooltip mouseEnterDelay={0.1} placement={'topLeft'} title={title}>
      <A className={styles.link} href={linkHref} onClick={handleClick}>
        <span aria-hidden className={styles.icon}>
          <FileIcon fileName={iconFileName} size={16} variant={'raw'} />
        </span>
        <span>{label}</span>
      </A>
    </Tooltip>
  );
});

Render.displayName = 'LocalFileLinkRender';

export default Render;
