'use client';

import { ActionIcon, Block } from '@lobehub/ui';
import { Spin } from 'antd';
import { Plus, X } from 'lucide-react';
import type { ChangeEvent, CSSProperties } from 'react';
import { memo, useCallback, useRef, useState } from 'react';

import Image from '@/libs/next/Image';
import { useFileStore } from '@/store/file';

import uploadCardStylesModule from './UploadCard.module.css';

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

export const UPLOAD_CARD_SIZE = 64;
const ADD_CIRCLE_SIZE = 28;

export type UploadData = string | { dimensions?: { height: number; width: number }; url: string };
export const uploadCardStyles = uploadCardStylesModule;

interface UploadCardProps {
  className?: string;
  closeClassName?: string;
  imageUrl?: string | null;
  label?: string;
  /** Show an upload spinner overlay (for externally-managed batch uploads). */
  loading?: boolean;
  maxFileSize?: number;
  /** Allow selecting multiple files at once (requires `onUploadFiles`). */
  multiple?: boolean;
  onRemove: () => void;
  onUpload: (data: UploadData) => void;
  /**
   * Batch upload handler. When provided, file selection is delegated to the
   * parent (which uploads + lands all files together) instead of the card's
   * internal single-file upload, enabling multi-select.
   */
  onUploadFiles?: (files: File[]) => void | Promise<void>;
  style?: CSSProperties;
  variant?: 'card' | 'circle';
}

const UploadCard = memo<UploadCardProps>(
  ({
    imageUrl,
    label,
    loading = false,
    onUpload,
    onUploadFiles,
    onRemove,
    maxFileSize,
    multiple = false,
    className,
    closeClassName,
    style,
    variant = 'card',
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const uploadWithProgress = useFileStore((s) => s.uploadWithProgress);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);

    // Combine internal single-upload spinner with externally-driven batch loading.
    const uploading = isUploading || loading;

    const handleFileSelect = useCallback(() => {
      if (loading) return;
      inputRef.current?.click();
    }, [loading]);

    const handleFileChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
        // When a batch handler is provided, delegate all selected files to the
        // parent so multiple references can be uploaded and landed at once.
        if (onUploadFiles) {
          const files = Array.from(e.target.files ?? []);
          if (files.length === 0) return;
          await onUploadFiles(files);
          return;
        }

        const file = e.target.files?.[0];
        if (!file) return;

        if (maxFileSize && file.size > maxFileSize) return;

        const previewUrl = URL.createObjectURL(file);
        setUploadPreview(previewUrl);
        setIsUploading(true);

        try {
          const result = await uploadWithProgress({
            file,
            onStatusUpdate: () => {},
            skipCheckFileType: true,
          });

          if (result?.url) {
            const data = result.dimensions
              ? { dimensions: result.dimensions, url: result.url }
              : result.url;
            onUpload(data);
          }
        } finally {
          URL.revokeObjectURL(previewUrl);
          setUploadPreview(null);
          setIsUploading(false);
        }
      },
      [maxFileSize, uploadWithProgress, onUpload, onUploadFiles],
    );

    const showPreview = uploadPreview || imageUrl;

    const fileInput = (
      <input
        accept="image/*"
        multiple={multiple}
        ref={inputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleFileChange}
        onClick={(e) => {
          e.currentTarget.value = '';
        }}
      />
    );

    if (variant === 'circle' && !showPreview) {
      return (
        <>
          {fileInput}
          <div
            className={`${uploadCardStyles.addCircle} ${className || ''}`}
            style={style}
            onClick={handleFileSelect}
          >
            <Plus size={14} />
          </div>
        </>
      );
    }

    if (showPreview) {
      return (
        <>
          {fileInput}
          <Block
            clickable
            className={cx(uploadCardStyles.filledCard, className)}
            style={style}
            variant={'outlined'}
            onClick={handleFileSelect}
          >
            <div className={uploadCardStyles.filledCardInner}>
              <Image
                fill
                unoptimized
                alt=""
                src={uploadPreview || imageUrl!}
                style={{ objectFit: 'cover' }}
              />
              {uploading && (
                <div className={uploadCardStyles.uploadOverlay}>
                  <Spin percent={'auto'} size="small" />
                </div>
              )}
            </div>
            {!uploading && (
              <ActionIcon
                glass
                className={cx(uploadCardStyles.closeButton, closeClassName, 'upload-card-close')}
                icon={X}
                size={12}
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              />
            )}
          </Block>
        </>
      );
    }

    return (
      <>
        {fileInput}
        <Block
          clickable
          align={'center'}
          className={cx(uploadCardStyles.placeholderCard, className)}
          gap={4}
          justify={'center'}
          style={style}
          variant={'filled'}
          onClick={handleFileSelect}
        >
          <Plus size={20} />
          {label && <span className={uploadCardStyles.label}>{label}</span>}
        </Block>
      </>
    );
  },
);

UploadCard.displayName = 'UploadCard';

export default UploadCard;
