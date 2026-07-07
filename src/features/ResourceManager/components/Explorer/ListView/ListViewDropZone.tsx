
import type { ReactNode, RefObject } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

import localStyles from './ListViewDropZone.module.css';
import { styles } from './styles';
import { useExplorerDropZone } from './useExplorerDropZone';

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

interface ListViewDropZoneProps {
  children: ReactNode;
  currentFolderId: string | null;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
}

const ListViewDropZone = ({ children, currentFolderId, virtuosoRef }: ListViewDropZoneProps) => {
  const { containerRef, handleDragLeave, handleDragOver, handleDrop, isDropZoneActive } =
    useExplorerDropZone(virtuosoRef);

  return (
    <div
      data-drop-target-id={currentFolderId || undefined}
      data-is-folder="true"
      ref={containerRef}
      className={cx(
        localStyles.container,
        'list-view-drop-zone',
        styles.dropZone,
        isDropZoneActive && styles.dropZoneActive,
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default ListViewDropZone;
