'use client';

import { Avatar, Icon } from '@lobehub/ui';
import { Spin, Upload } from 'antd';
import { Loader2, PencilIcon, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import { imageToBase64 } from '@/utils/imageToBase64';
import { createUploadImageHandler } from '@/utils/uploadFIle';

import styles from './index.module.css';

// Image-only avatar control (Upload + square-crop + pencil hover overlay).
// Use when an avatar must come from an uploaded image rather than an emoji.
interface AvatarUploadProps {
  /** Show the hover delete badge (i.e. a real avatar is set). */
  allowDelete?: boolean;
  compressSize?: number;
  loading?: boolean;
  onDelete?: () => void;
  onUpload?: (file: File) => void;
  shape?: 'circle' | 'square';
  size?: number;
  title?: string;
  /** Image URL, or a name string for the generated letter-avatar preview. */
  value?: string;
}

const AvatarUpload = memo<AvatarUploadProps>(
  ({
    value,
    onUpload,
    onDelete,
    allowDelete,
    loading,
    compressSize = 256,
    shape = 'square',
    size = 72,
    title,
  }) => {
    const handleUpload = useMemo(
      () =>
        createUploadImageHandler(async (dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          await new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
          });
          const webpBase64 = imageToBase64({ img, size: compressSize });
          const blob = await (await fetch(webpBase64)).blob();
          onUpload?.(new File([blob], 'avatar.webp', { type: 'image/webp' }));
        }),
      [compressSize, onUpload],
    );

    return (
      <Upload beforeUpload={handleUpload} itemRender={() => void 0} maxCount={1}>
        <Spin indicator={<Icon spin icon={Loader2} />} spinning={!!loading}>
          <div className={styles.wrapper}>
            <Avatar avatar={value} shape={shape} size={size} title={title} />
            <div className={`${styles.overlay} avatar-edit-overlay`}>
              <Icon
                color={'var(--ant-color-text-light-solid)'}
                icon={PencilIcon}
                size={Math.round(size / 3)}
              />
            </div>
            {allowDelete && (
              <div
                className={`${styles.delete} avatar-delete-badge`}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.();
                }}
              >
                <Icon icon={X} size={12} />
              </div>
            )}
          </div>
        </Spin>
      </Upload>
    );
  },
);

AvatarUpload.displayName = 'AvatarUpload';

export default AvatarUpload;
