import { createRawModal, Flexbox, Tag, Tooltip } from '@lobehub/ui';
import { Progress } from 'antd';
import { memo } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';
import { useFileStore } from '@/store/file';
import { type UploadFileItem } from '@/types/files/upload';
import { UPLOAD_STATUS_SET } from '@/types/files/upload';

import Content from './Content';
import FilePreviewModal from './FilePreviewModal';
import styles from './index.module.css';
import { getFileBasename } from './utils';

type FileItemProps = UploadFileItem;

const ContextItem = memo<FileItemProps>((props) => {
  const { file, id, status, uploadState } = props;
  const [removeChatUploadFile] = useFileStore((s) => [s.removeChatUploadFile]);

  const basename = getFileBasename(file.name);
  const isUploading = UPLOAD_STATUS_SET.has(status);
  const progress = uploadState?.progress ?? 0;

  const handleClick = useEventCallback(() => {
    createRawModal(FilePreviewModal, {
      file: props,
    });
  });

  const handleClose = useEventCallback(() => {
    removeChatUploadFile(id);
  });
  return (
    <Tag closable size={'large'} onClick={handleClick} onClose={handleClose}>
      <Flexbox horizontal align={'center'} className={styles.content}>
        <Flexbox className={styles.icon}>
          <Content {...props} />
          {isUploading && (
            <div className={styles.progress}>
              <Progress
                percent={progress}
                showInfo={false}
                size={14}
                strokeWidth={2}
                type="circle"
              />
            </div>
          )}
        </Flexbox>
        <Tooltip title={file.name}>
          <span className={styles.name}>{basename}</span>
        </Tooltip>
      </Flexbox>
    </Tag>
  );
});

export default ContextItem;
