'use client';

import { Flexbox, Icon, Tooltip } from '@lobehub/ui';
import { LockIcon, UsersIcon } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useActiveWorkspaceId } from '@/business/client/hooks/useActiveWorkspaceId';
import { useResourceManagerStore } from '@/routes/(main)/resource/features/store';
import type { ResourceListVisibilityFilter } from '@/routes/(main)/resource/features/store/initialState';

import styles from './index.module.css';

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

const OPTIONS: Array<{
  icon: typeof LockIcon;
  key: ResourceListVisibilityFilter;
  labelKey: string;
  tooltipKey: string;
}> = [
  {
    icon: LockIcon,
    key: 'private',
    labelKey: 'resources.visibility.private',
    tooltipKey: 'resources.mode.privateHint',
  },
  {
    icon: UsersIcon,
    key: 'workspace',
    labelKey: 'resources.visibility.workspace',
    tooltipKey: 'resources.mode.workspaceHint',
  },
];

/**
 * Sidebar-top dual toggle: `[🔒 Private] [👥 Workspace]`.
 *
 * Rendered only in team-workspace mode — personal mode has no notion of
 * visibility, so the toggle is meaningless there and is deliberately hidden.
 * Selecting a mode drives both the list filter (via `listVisibility`) and the
 * upload default (via `useTopLevelFileUpload`), so a single click switches
 * both what the user sees and where the next upload lands.
 */
const ResourceModeToggle = memo(() => {
  const { t } = useTranslation('chat');
  const activeWorkspaceId = useActiveWorkspaceId();
  const [listVisibility, setListVisibility, hydrateListVisibility] = useResourceManagerStore(
    (s) => [s.listVisibility, s.setListVisibility, s.hydrateListVisibility],
  );

  const workspaceId = activeWorkspaceId ?? undefined;

  // Rehydrate from localStorage whenever the active workspace changes, so
  // switching workspaces (or coming back after a reload) restores the mode
  // this user last used in *this* workspace. Personal mode falls through to
  // the initialState default.
  useEffect(() => {
    hydrateListVisibility(workspaceId);
  }, [workspaceId, hydrateListVisibility]);

  if (!workspaceId) return null;

  return (
    <Flexbox paddingBlock={6} paddingInline={4}>
      <div className={styles.group} role={'tablist'}>
        {OPTIONS.map((option) => {
          const isActive = listVisibility === option.key;
          const OptionIcon = option.icon;
          const label = t(option.labelKey as never);
          return (
            <Tooltip key={option.key} title={t(option.tooltipKey as never)}>
              <button
                aria-selected={isActive}
                className={cx(styles.button, isActive && styles.buttonActive)}
                role={'tab'}
                type={'button'}
                onClick={() => {
                  if (isActive) return;
                  setListVisibility(option.key, workspaceId);
                }}
              >
                <Icon icon={OptionIcon} size={14} />
                <span>{label}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </Flexbox>
  );
});

ResourceModeToggle.displayName = 'ResourceModeToggle';

export default ResourceModeToggle;
