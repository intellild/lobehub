import { ActionIcon, Image } from '@lobehub/ui';
import { Trash } from 'lucide-react';
import { memo } from 'react';

import styles from './Image.module.css';
import { MIN_IMAGE_SIZE } from './style';

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

interface FileItemProps {
  alt?: string;
  loading?: boolean;
  onRemove?: () => void;
  src?: string;
}

const FileItem = memo<FileItemProps>(({ alt, onRemove, src, loading }) => {
  const IMAGE_SIZE = MIN_IMAGE_SIZE;

  return (
    <Image
      alwaysShowActions
      alt={alt || ''}
      classNames={{ wrapper: cx(styles.image, styles.editableImage) }}
      height={64}
      isLoading={loading}
      objectFit={'cover'}
      size={IMAGE_SIZE as any}
      src={src}
      width={64}
      actions={
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
      }
    />
  );
});

export default FileItem;
