'use client';

import type { FileSearchResult } from '@lobechat/types';
import { Center, Flexbox, MaterialFileTypeIcon, Text, Tooltip } from '@lobehub/ui';
import { useTheme } from 'next-themes';
import { memo } from 'react';

import { styles } from './style';

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

export interface FileItemProps extends FileSearchResult {
  index: number;
}

const FileItem = memo<FileItemProps>(({ fileId, fileName, relevanceScore }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.container, isDarkMode ? styles.containerDark : styles.containerLight)}
      gap={4}
      key={fileId}
    >
      <MaterialFileTypeIcon filename={fileName} size={20} type={'file'} variant={'raw'} />
      <Flexbox horizontal gap={12} justify={'space-between'} style={{ maxWidth: 200 }}>
        <Text ellipsis>{fileName}</Text>
        <Tooltip title={`Relevance: ${(relevanceScore * 100).toFixed(1)}%`}>
          <Center className={styles.badge}>{relevanceScore.toFixed(2)}</Center>
        </Tooltip>
      </Flexbox>
    </Flexbox>
  );
});

export default FileItem;
