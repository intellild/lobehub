import { Image } from '@lobehub/ui';
import { memo } from 'react';

import FileIcon from '@/components/FileIcon';
import { type UploadFileItem } from '@/types/files/upload';

import styles from './Content.module.css';

const Content = memo<UploadFileItem>(({ file, previewUrl }) => {
  if (file.type.startsWith('image')) {
    return <Image alt={file.name} classNames={{ wrapper: styles.image }} src={previewUrl} />;
  }

  if (file.type.startsWith('video')) {
    return <video className={styles.video} src={previewUrl} width={'100%'} />;
  }

  return <FileIcon fileName={file.name} fileType={file.type} size={48} />;
});

export default Content;
