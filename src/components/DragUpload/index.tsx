 
import { Center, Flexbox, Icon } from '@lobehub/ui';
import { FileImage, FileText, FileUpIcon } from 'lucide-react';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';
import { getContainer, useDragUpload } from './useDragUpload';

const BLOCK_SIZE = 64;
const ICON_SIZE = { size: 36, strokeWidth: 1.5 };

interface DragUploadProps {
  enabledFiles?: boolean;
  onUploadFiles: (files: File[]) => Promise<void>;
}

const DragUpload = memo<DragUploadProps>(({ enabledFiles = true, onUploadFiles }) => {
  const { t } = useTranslation('components');

  const isDragging = useDragUpload(onUploadFiles);

  if (isDragging) return;

  return createPortal(
    <Center className={styles.wrapper}>
      <div className={styles.container}>
        <Center className={styles.content} gap={12}>
          <Flexbox horizontal className={styles.iconGroup}>
            <Center className={styles.iconLeft} height={BLOCK_SIZE * 1.25} width={BLOCK_SIZE}>
              <Icon icon={FileImage} size={ICON_SIZE} />
            </Center>
            <Center
              className={styles.icon}
              height={BLOCK_SIZE * 1.25}
              width={BLOCK_SIZE}
              style={{
                transform: 'translateY(-12px)',
                zIndex: 1,
              }}
            >
              <Icon icon={FileUpIcon} size={ICON_SIZE} />
            </Center>
            <Center className={styles.iconRight} height={BLOCK_SIZE * 1.25} width={BLOCK_SIZE}>
              <Icon icon={FileText} size={ICON_SIZE} />
            </Center>
          </Flexbox>
          <Flexbox align={'center'} gap={8} style={{ textAlign: 'center' }}>
            <Flexbox className={styles.title}>
              {t(enabledFiles ? 'DragUpload.dragFileTitle' : 'DragUpload.dragTitle')}
            </Flexbox>
            <Flexbox className={styles.desc}>
              {t(enabledFiles ? 'DragUpload.dragFileDesc' : 'DragUpload.dragDesc')}
            </Flexbox>
          </Flexbox>
        </Center>
      </div>
    </Center>,
    getContainer()!,
  );
});

export default DragUpload;
