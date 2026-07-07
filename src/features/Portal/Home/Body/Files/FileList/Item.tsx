import { type ChatFileItem } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';

import FileIcon from '@/components/FileIcon';
import { useChatStore } from '@/store/chat';
import { formatSize } from '@/utils/format';

import styles from './Item.module.css';

const FileItem = memo<ChatFileItem>(({ name, fileType, size, id }) => {
  const openFilePreview = useChatStore((s) => s.openFilePreview);

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={styles.container}
      gap={8}
      onClick={() => {
        openFilePreview({ fileId: id });
      }}
    >
      <FileIcon fileName={name} fileType={fileType} />
      <Flexbox>
        <Text ellipsis={{ tooltip: true }}>{name}</Text>
        <Text type={'secondary'}>{formatSize(size)}</Text>
      </Flexbox>
    </Flexbox>
  );
});

export default FileItem;
