'use client';

import { Center, Flexbox, Icon } from '@lobehub/ui';
import { FileImage, FileText, FileUpIcon, FolderIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode } from 'react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useDragUploadContext } from './DragUploadProvider';
import stylesModule from './index.module.css';
import { type DroppedLocalPath, useLocalDragUpload } from './useLocalDragUpload';

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

const BLOCK_SIZE = 48;
const ICON_SIZE = { size: 28, strokeWidth: 1.5 };
const OVERLAY_INSET = 28;
const OVERLAY_BORDER_INSET = 10;

const DEFAULT_TONE = {
  iconColor: `color-mix(in srgb, ${'var(--ant-geekblue)'} 95%, black)`,
  iconStrongBg: `color-mix(in srgb, ${'var(--ant-geekblue)'} 38%, white)`,
  iconSoftBg: `color-mix(in srgb, ${'var(--ant-geekblue)'} 68%, white)`,
};

const LOCAL_PATH_TONE = {
  iconColor: `color-mix(in srgb, ${'var(--ant-purple)'} 82%, black)`,
  iconStrongBg: `color-mix(in srgb, ${'var(--ant-purple)'} 36%, white)`,
  iconSoftBg: `color-mix(in srgb, ${'var(--ant-purple)'} 64%, white)`,
};
const styles = stylesModule;

export interface DragUploadZoneProps {
  /**
   * The content to render inside the drop zone
   */
  children: ReactNode;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Whether the drop zone is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show file types (images + documents) or just images
   * @default true
   */
  enabledFiles?: boolean;
  /**
   * Whether dropping local files/folders should insert their filesystem paths
   * into the chat input instead of uploading them. Requires Electron (uses
   * webUtils to resolve paths). Unresolved items fall back to upload.
   */
  enableLocalPathReference?: boolean;
  /**
   * Callback when top-level local files/folders are dropped and local path
   * reference mode is on.
   */
  onLocalPaths?: (paths: DroppedLocalPath[]) => void | Promise<void>;
  /**
   * Callback when files are dropped
   */
  onUploadFiles: (files: File[]) => void | Promise<void>;
  /**
   * Minimum height of the overlay content
   */
  overlayMinHeight?: number;
  /**
   * Custom style for the container
   */
  style?: CSSProperties;
}

const DragUploadZone = memo<DragUploadZoneProps>(
  ({
    children,
    className,
    disabled = false,
    enabledFiles = true,
    enableLocalPathReference = false,
    onLocalPaths,
    overlayMinHeight = 160,
    onUploadFiles,
    style,
  }) => {
    const { t } = useTranslation('components');

    // Global drag state - shows overlay when dragging anywhere on page
    const { isDraggingGlobally, dragContentKind } = useDragUploadContext();

    // Local drop handler - only handles drop events
    const { getContainerProps } = useLocalDragUpload({
      disabled,
      enableLocalPathReference,
      onLocalPaths,
      onUploadFiles,
    });

    // Show overlay when files are being dragged anywhere on the page
    const showOverlay = isDraggingGlobally && !disabled;
    const isLocalPathReferenceOverlay = enableLocalPathReference && dragContentKind !== 'none';

    // Local path reference mode has distinct copy and tone so users can tell it
    // will insert filesystem references rather than upload files.
    const overlayCopy = useMemo(() => {
      if (isLocalPathReferenceOverlay) {
        return {
          desc: t('DragUpload.dragLocalPathDesc'),
          showFolderIcon: dragContentKind === 'folders',
          title: t('DragUpload.dragLocalPathTitle'),
        };
      }
      if (dragContentKind === 'folders') {
        return {
          desc: t('DragUpload.dragFolderDesc'),
          showFolderIcon: true,
          title: t('DragUpload.dragFolderTitle'),
        };
      }
      if (dragContentKind === 'mixed') {
        return {
          desc: t('DragUpload.dragMixedDesc'),
          showFolderIcon: true,
          title: t('DragUpload.dragMixedTitle'),
        };
      }
      return {
        desc: t(enabledFiles ? 'DragUpload.dragFileDesc' : 'DragUpload.dragDesc'),
        showFolderIcon: false,
        title: t(enabledFiles ? 'DragUpload.dragFileTitle' : 'DragUpload.dragTitle'),
      };
    }, [dragContentKind, enabledFiles, isLocalPathReferenceOverlay, t]);

    const overlayIcons = useMemo(() => {
      if (isLocalPathReferenceOverlay && dragContentKind === 'mixed') {
        return [FolderIcon, FileUpIcon, FileText];
      }
      if (overlayCopy.showFolderIcon) return [FolderIcon, FolderIcon, FolderIcon];
      return [FileImage, FileUpIcon, FileText];
    }, [dragContentKind, isLocalPathReferenceOverlay, overlayCopy.showFolderIcon]);
    const tone = isLocalPathReferenceOverlay ? LOCAL_PATH_TONE : DEFAULT_TONE;

    return (
      <div className={cx(styles.container, className)} style={style} {...getContainerProps()}>
        {children}
        {showOverlay && (
          <div className={styles.overlay}>
            <div
              style={{ minHeight: overlayMinHeight }}
              className={cx(
                styles.overlayContent,
                isLocalPathReferenceOverlay && styles.overlayContentLocalPath,
              )}
            >
              <Center className={styles.content} gap={8}>
                <Flexbox horizontal className={styles.iconGroup}>
                  <Center
                    className={styles.icon}
                    height={BLOCK_SIZE * 1.2}
                    width={BLOCK_SIZE}
                    style={{
                      background: tone.iconSoftBg,
                      color: tone.iconColor,
                      transform: 'rotateZ(-20deg) translateX(8px)',
                    }}
                  >
                    <Icon icon={overlayIcons[0]} size={ICON_SIZE} />
                  </Center>
                  <Center
                    className={styles.icon}
                    height={BLOCK_SIZE * 1.2}
                    width={BLOCK_SIZE}
                    style={{
                      background: tone.iconStrongBg,
                      color: tone.iconColor,
                      transform: 'translateY(-10px)',
                      zIndex: 1,
                    }}
                  >
                    <Icon icon={overlayIcons[1]} size={ICON_SIZE} />
                  </Center>
                  <Center
                    className={styles.icon}
                    height={BLOCK_SIZE * 1.2}
                    width={BLOCK_SIZE}
                    style={{
                      background: tone.iconSoftBg,
                      color: tone.iconColor,
                      transform: 'rotateZ(20deg) translateX(-8px)',
                    }}
                  >
                    <Icon icon={overlayIcons[2]} size={ICON_SIZE} />
                  </Center>
                </Flexbox>
                <Flexbox align={'center'} gap={4} style={{ textAlign: 'center' }}>
                  <Flexbox className={styles.title}>{overlayCopy.title}</Flexbox>
                  <Flexbox className={styles.desc}>{overlayCopy.desc}</Flexbox>
                </Flexbox>
              </Center>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DragUploadZone.displayName = 'DragUploadZone';

export type { DroppedLocalPath } from './useLocalDragUpload';
export { usePasteFile } from './usePasteFile';
export { useUploadFiles } from './useUploadFiles';
export default DragUploadZone;
