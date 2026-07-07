'use client';

import { Alert, Flexbox, MaterialFileTypeIcon, Text } from '@lobehub/ui';
import { Descriptions } from 'antd';
import { memo } from 'react';

import type { FileContentDetail } from '../../../types';
import styles from './FileCard.module.css';

interface FileCardProps {
  file: FileContentDetail;
}

const FileCard = memo<FileCardProps>(({ file }) => {
  if (file.error) {
    return (
      <Flexbox className={styles.container} gap={8}>
        <Flexbox className={styles.cardBody} gap={8}>
          <Flexbox horizontal align={'center'} className={styles.titleRow} gap={8}>
            <MaterialFileTypeIcon
              filename={file.filename}
              size={16}
              type={'file'}
              variant={'raw'}
            />
            <div className={styles.title}>{file.filename}</div>
          </Flexbox>
        </Flexbox>
        <div className={styles.footer}>
          <Alert message={file.error} type={'error'} variant={'borderless'} />
        </div>
      </Flexbox>
    );
  }

  return (
    <Flexbox className={styles.container} justify={'space-between'}>
      <Flexbox className={styles.cardBody} gap={8}>
        <Flexbox horizontal align={'center'} className={styles.titleRow} gap={8}>
          <MaterialFileTypeIcon filename={file.filename} size={16} type={'file'} variant={'raw'} />
          <div className={styles.title}>{file.filename}</div>
        </Flexbox>
        {file.preview && (
          <Text
            code
            as={'span'}
            className={styles.preview}
            ellipsis={{ rows: 4 }}
            fontSize={12}
            type={'secondary'}
          >
            {file.preview}...
          </Text>
        )}
      </Flexbox>
      <div className={styles.footer}>
        <Descriptions
          column={2}
          size="small"
          classNames={{
            content: styles.footerText,
            label: styles.footerText,
          }}
          items={[
            {
              children: file.totalCharCount?.toLocaleString(),
              label: 'Chars',
            },
            {
              children: file.totalLineCount?.toLocaleString(),
              label: 'Lines',
            },
          ]}
        />
      </div>
    </Flexbox>
  );
});

export default FileCard;
