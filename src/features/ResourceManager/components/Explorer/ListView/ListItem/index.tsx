import { Avatar, Center, Checkbox, ContextMenuTrigger, Flexbox, Tooltip } from '@lobehub/ui';
import { isEqual } from 'es-toolkit';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useResourceManagerStore } from '@/routes/(main)/resource/features/store';
import { isExplorerItemSelected } from '@/routes/(main)/resource/features/store/selectors';
import { fileManagerSelectors, getChunkTargetId, useFileStore } from '@/store/file';
import type { FileListItem as FileListItemType } from '@/types/files';
import { formatSize } from '@/utils/format';

import { useFileItemClick } from '../../hooks/useFileItemClick';
import { useFileItemDropdown } from '../../ItemDropdown/useFileItemDropdown';
import { getListViewMinWidth } from './constants';
import FileListItemActions from './FileListItemActions';
import FileListItemName from './FileListItemName';
import styles from './index.module.css';
import { useFileListItemDrag } from './useFileListItemDrag';
import { useFileListItemMeta } from './useFileListItemMeta';
import { useFileListItemRename } from './useFileListItemRename';

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

export const FILE_DATE_WIDTH = 160;
export const FILE_SIZE_WIDTH = 140;

interface FileListItemProps extends FileListItemType {
  columnWidths: {
    date: number;
    name: number;
    size: number;
    uploader: number;
  };
  index: number;
  onSelectedChange: (id: string, selected: boolean, shiftKey: boolean, index: number) => void;
  selected?: boolean;
  showUploader?: boolean;
  slug?: string | null;
}

const FileListItem = ({
  chunkCount,
  chunkingError,
  chunkingStatus,
  columnWidths,
  createdAt,
  embeddingError,
  embeddingStatus,
  fileId,
  fileType,
  finishEmbedding,
  id,
  index,
  metadata,
  name,
  onSelectedChange,
  selected,
  showUploader = true,
  size,
  slug,
  sourceType,
  uploader,
  url,
  userId,
  visibility,
}: FileListItemProps) => {
  const { t } = useTranslation(['components', 'file']);
  const uploaderName =
    uploader?.fullName || uploader?.username || (uploader?.id ? uploader.id.slice(0, 8) : '');
  const chunkTargetId = getChunkTargetId({ fileId, id });
  const fileStoreState = useFileStore(
    (s) => ({
      isCreatingFileParseTask: fileManagerSelectors.isCreatingFileParseTask(chunkTargetId)(s),
      parseFiles: s.parseFilesToChunks,
      refreshFileList: s.refreshFileList,
      updateResource: s.updateResource,
    }),
    isEqual,
  );
  const resourceManagerState = useResourceManagerStore(
    (s) => ({
      isPendingRename: s.pendingRenameItemId === id,
      libraryId: s.libraryId,
      selected: isExplorerItemSelected({
        id,
        selectAllState: s.selectAllState,
        selectedIds: s.selectedFileIds,
      }),
      setPendingRenameItemId: s.setPendingRenameItemId,
    }),
    shallow,
  );
  const isSelected = selected ?? resourceManagerState.selected;

  const { displayTime, emoji, isFolder, isPage, isSupportedForChunking } = useFileListItemMeta({
    createdAt,
    fileType,
    metadata,
    name,
    sourceType,
  });
  const {
    handleDragEnd,
    handleDragLeave,
    handleDragOver,
    handleDragStart,
    handleDrop,
    isDragging,
    isOver,
  } = useFileListItemDrag({
    fileType,
    id,
    isFolder,
    libraryId: resourceManagerState.libraryId,
    name,
    sourceType,
  });
  const {
    handleRenameCancel,
    handleRenameConfirm,
    handleRenameStart,
    inputRef,
    isRenaming,
    renamingValue,
    setRenamingValue,
  } = useFileListItemRename({
    id,
    isPendingRename: resourceManagerState.isPendingRename,
    isFolder,
    libraryId: resourceManagerState.libraryId,
    name,
    refreshFileList: fileStoreState.refreshFileList,
    setPendingRenameItemId: resourceManagerState.setPendingRenameItemId,
    updateResource: fileStoreState.updateResource,
  });

  const handleItemClick = useFileItemClick({
    id,
    isFolder,
    isPage,
    libraryId: resourceManagerState.libraryId,
    slug,
  });
  const { menuItems } = useFileItemDropdown({
    fileType,
    filename: name,
    id,
    libraryId: resourceManagerState.libraryId,
    onRenameStart: isFolder ? handleRenameStart : undefined,
    sourceType,
    url,
    userId,
    visibility,
  });

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectedChange(id, !isSelected, e.shiftKey, index);
    },
    [id, index, isSelected, onSelectedChange],
  );

  const handleCheckboxPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      e.preventDefault();
    }
  }, []);

  return (
    <ContextMenuTrigger items={menuItems}>
      <Flexbox
        horizontal
        align={'center'}
        data-drop-target-id={id}
        data-is-folder={String(isFolder)}
        data-row-index={index}
        draggable={!!resourceManagerState.libraryId}
        height={48}
        paddingInline={8}
        className={cx(
          styles.container,
          'file-list-item-group',
          index % 2 === 0 && styles.evenRow,
          isSelected && styles.selected,
          isDragging && styles.dragging,
          isOver && styles.dragOver,
        )}
        style={{
          borderBlockEnd: `1px solid ${'var(--ant-color-border-secondary)'}`,
          minWidth: getListViewMinWidth(showUploader),
          userSelect: 'none',
        }}
        onClick={handleItemClick}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      >
        <Center
          height={40}
          style={{ paddingInline: 4 }}
          onClick={handleCheckboxClick}
          onPointerDown={handleCheckboxPointerDown}
        >
          <Checkbox checked={isSelected} />
        </Center>
        <Flexbox
          horizontal
          align={'center'}
          className={styles.item}
          distribution={'space-between'}
          style={{
            flexShrink: 0,
            maxWidth: columnWidths.name,
            minWidth: columnWidths.name,
            paddingInline: 8,
            width: columnWidths.name,
          }}
        >
          <FileListItemName
            emoji={emoji}
            fallbackName={t('file:pageList.untitled')}
            fileType={fileType}
            inputRef={inputRef}
            isFolder={isFolder}
            isPage={isPage}
            isRenaming={isRenaming}
            name={name}
            renamingValue={renamingValue}
            onRenameCancel={handleRenameCancel}
            onRenameConfirm={handleRenameConfirm}
            onRenamingValueChange={setRenamingValue}
          />
          <FileListItemActions
            chunkCount={chunkCount}
            chunkingError={chunkingError}
            chunkingStatus={chunkingStatus}
            embeddingError={embeddingError}
            embeddingStatus={embeddingStatus}
            fileId={fileId}
            finishEmbedding={finishEmbedding}
            id={id}
            isCreatingFileParseTask={fileStoreState.isCreatingFileParseTask}
            isFolder={isFolder}
            isPage={isPage}
            isSupportedForChunking={isSupportedForChunking}
            menuItems={menuItems}
            parseFiles={fileStoreState.parseFiles}
            t={t}
          />
        </Flexbox>
        {!isDragging && (
          <>
            <Flexbox
              horizontal
              align={'center'}
              className={styles.item}
              gap={8}
              style={{ flexShrink: 0 }}
              width={columnWidths.date}
            >
              <span>{displayTime}</span>
            </Flexbox>
            {showUploader && (
              <Flexbox
                horizontal
                align={'center'}
                className={styles.item}
                gap={8}
                style={{ flexShrink: 0 }}
                width={columnWidths.uploader}
              >
                {uploaderName ? (
                  <Tooltip title={t('file:listView.uploadedBy', { name: uploaderName })}>
                    <Flexbox horizontal align={'center'} gap={8} style={{ minWidth: 0 }}>
                      <Avatar
                        alt={uploaderName}
                        avatar={uploader?.avatar || uploaderName}
                        shape={'circle'}
                        size={20}
                        style={{ flexShrink: 0 }}
                      />
                      <span className={styles.uploaderName}>{uploaderName}</span>
                    </Flexbox>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </Flexbox>
            )}
            <Flexbox className={styles.item} style={{ flexShrink: 0 }} width={columnWidths.size}>
              {isFolder || isPage ? '-' : formatSize(size)}
            </Flexbox>
          </>
        )}
      </Flexbox>
    </ContextMenuTrigger>
  );
};

export default memo(FileListItem);
