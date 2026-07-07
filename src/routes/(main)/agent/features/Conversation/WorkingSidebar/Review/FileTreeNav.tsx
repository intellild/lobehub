'use client';
import { memo, useMemo } from 'react';

import {
  ExplorerTree,
  FOLDER_ICON_CSS,
  getExplorerTreeStyleVars,
  HIDE_POINTER_FOCUS_RING_CSS,
} from '@/features/ExplorerTree';

import styles from './FileTreeNav.module.css';
import { buildReviewTreeNodes, type ReviewTreeData, type ReviewTreeGroup } from './reviewTreeNodes';

const FILE_TREE_UNSAFE_CSS = `${FOLDER_ICON_CSS}\n${HIDE_POINTER_FOCUS_RING_CSS}`;

interface FileTreeNavProps {
  /** itemKey of the file whose diff is currently focused — highlighted in the tree. */
  activeFileKey?: string;
  groups: ReviewTreeGroup[];
  /** Fired when a file leaf is clicked — the diff list scrolls to & expands it. */
  onSelectFile: (key: string) => void;
  showGroupHeaders: boolean;
}

/**
 * Navigation-only directory tree for the Review panel's right rail. Reuses the
 * Files-tab `ExplorerTree` so folder / file-type icons match exactly; clicking a
 * leaf scrolls the left diff list to that file's patch (no diff embedded here).
 */
const FileTreeNav = memo<FileTreeNavProps>(
  ({ activeFileKey, groups, onSelectFile, showGroupHeaders }) => {
    const nodes = useMemo(
      () => buildReviewTreeNodes(groups, showGroupHeaders),
      [groups, showGroupHeaders],
    );
    // Folders start expanded so the full outline shows whenever the rail opens.
    const defaultExpandedIds = useMemo(
      () => nodes.filter((node) => node.isFolder).map((node) => node.id),
      [nodes],
    );
    const selectedIds = useMemo(
      () =>
        activeFileKey ? nodes.filter((n) => n.data?.key === activeFileKey).map((n) => n.id) : [],
      [nodes, activeFileKey],
    );
    const treeStyleVars = useMemo(
      () => getExplorerTreeStyleVars({ reserveChevronSlot: nodes.some((node) => node.isFolder) }),
      [nodes],
    );

    return (
      <div className={styles.tree} style={treeStyleVars}>
        <ExplorerTree<ReviewTreeData>
          iconsColored
          defaultExpandedIds={defaultExpandedIds}
          iconSet="complete"
          nodes={nodes}
          selectedIds={selectedIds}
          style={{ height: '100%' }}
          unsafeCSS={FILE_TREE_UNSAFE_CSS}
          onNodeClick={(node) => {
            if (node.isFolder || !node.data) return;
            onSelectFile(node.data.key);
          }}
        />
      </div>
    );
  },
);

FileTreeNav.displayName = 'AgentWorkingSidebarReviewFileTreeNav';

export default FileTreeNav;
