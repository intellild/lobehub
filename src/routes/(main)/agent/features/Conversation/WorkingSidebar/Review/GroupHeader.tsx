'use client';

import { ActionIcon } from '@lobehub/ui';
import { ChevronRightIcon, FoldVerticalIcon, UnfoldVerticalIcon } from 'lucide-react';
import { type KeyboardEvent, memo, type MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './GroupHeader.module.css';

export interface GroupHeaderProps {
  branch?: string;
  collapsed: boolean;
  /** True iff every file diff in the group is currently expanded — drives
   * the fold-button's icon + label. */
  diffsAllExpanded: boolean;
  /** Suppress the fold-all-diffs button (collapsed groups, empty groups). */
  hideFoldButton?: boolean;
  name: string;
  onToggleCollapsed: () => void;
  onToggleDiffs: () => void;
  patchCount: number;
  totalAdditions: number;
  totalDeletions: number;
}

const GroupHeader = memo<GroupHeaderProps>(
  ({
    branch,
    collapsed,
    diffsAllExpanded,
    hideFoldButton,
    name,
    onToggleCollapsed,
    onToggleDiffs,
    patchCount,
    totalAdditions,
    totalDeletions,
  }) => {
    const { t } = useTranslation('chat');
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleCollapsed();
        }
      },
      [onToggleCollapsed],
    );
    const handleFoldClick = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        onToggleDiffs();
      },
      [onToggleDiffs],
    );
    const foldLabel = diffsAllExpanded
      ? t('workingPanel.review.group.collapseDiffs')
      : t('workingPanel.review.group.expandDiffs');
    return (
      <div
        aria-expanded={!collapsed}
        className={styles.header}
        data-review-group-header={''}
        role={'button'}
        tabIndex={0}
        onClick={onToggleCollapsed}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.meta}>
          <ChevronRightIcon
            className={styles.chevron}
            data-expanded={collapsed ? 'false' : 'true'}
            size={14}
          />
          <span className={styles.name}>{name}</span>
          <span className={styles.fileCount}>
            {t('workingPanel.review.group.fileCount', { count: patchCount })}
          </span>
          {(totalAdditions > 0 || totalDeletions > 0) && (
            <span className={styles.stats}>
              {totalAdditions > 0 && <span className={styles.additions}>+{totalAdditions}</span>}
              {totalDeletions > 0 && <span className={styles.deletions}>-{totalDeletions}</span>}
            </span>
          )}
          {branch && (
            <span className={styles.branch} title={branch}>
              {branch}
            </span>
          )}
        </div>
        {!hideFoldButton && (
          <ActionIcon
            aria-label={foldLabel}
            aria-pressed={diffsAllExpanded}
            className={styles.foldButton}
            icon={diffsAllExpanded ? FoldVerticalIcon : UnfoldVerticalIcon}
            size={'small'}
            title={foldLabel}
            onClick={handleFoldClick}
          />
        )}
      </div>
    );
  },
);

GroupHeader.displayName = 'AgentWorkingSidebarReviewGroupHeader';

export default GroupHeader;
