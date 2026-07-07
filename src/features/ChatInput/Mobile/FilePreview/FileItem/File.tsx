import { ActionIcon, Flexbox, Text } from '@lobehub/ui';
import { Trash } from 'lucide-react';
import { memo } from 'react';

import FileIcon from '@/components/FileIcon';
import UploadDetail from '@/features/ChatInput/components/UploadDetail';
import { type UploadFileItem } from '@/types/files';

import styles from './File.module.css';

interface FileItemProps extends UploadFileItem {
  onRemove?: () => void;
}

const FileItem = memo<FileItemProps>(({ id, onRemove, file, status, uploadState, tasks }) => {
  return (
    <Flexbox horizontal align={'center'} className={styles.container} gap={12} key={id}>
      <FileIcon fileName={file.name} fileType={file.type} />
      <Flexbox style={{ overflow: 'hidden' }}>
        <Text ellipsis>{file.name}</Text>
        <UploadDetail size={file.size} status={status} tasks={tasks} uploadState={uploadState} />
      </Flexbox>
      <ActionIcon
        glass
        className={styles.deleteButton}
        icon={Trash}
        size={'small'}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
      />
    </Flexbox>
  );
});
export default FileItem;
