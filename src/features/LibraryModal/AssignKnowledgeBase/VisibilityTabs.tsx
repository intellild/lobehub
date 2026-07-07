'use client';

import { Icon } from '@lobehub/ui';
import { LockIcon, UsersIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './VisibilityTabs.module.css';

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

export type PickerVisibility = 'private' | 'public';

interface VisibilityTabsProps {
  onChange: (value: PickerVisibility) => void;
  value: PickerVisibility;
}

// Mirrors ResourceModeToggle's visual language so the picker feels like the
// same primitive as the sidebar toggle — same iconography, same label copy.
const OPTIONS: Array<{ icon: typeof LockIcon; key: PickerVisibility; labelKey: string }> = [
  { icon: UsersIcon, key: 'public', labelKey: 'resources.visibility.workspace' },
  { icon: LockIcon, key: 'private', labelKey: 'resources.visibility.private' },
];

const VisibilityTabs = memo<VisibilityTabsProps>(({ value, onChange }) => {
  const { t } = useTranslation('chat');

  return (
    <div className={styles.group} role={'tablist'}>
      {OPTIONS.map((option) => {
        const isActive = value === option.key;
        const OptionIcon = option.icon;
        return (
          <button
            aria-selected={isActive}
            className={cx(styles.button, isActive && styles.buttonActive)}
            key={option.key}
            role={'tab'}
            type={'button'}
            onClick={() => {
              if (isActive) return;
              onChange(option.key);
            }}
          >
            <Icon icon={OptionIcon} size={14} />
            <span>{t(option.labelKey as never)}</span>
          </button>
        );
      })}
    </div>
  );
});

VisibilityTabs.displayName = 'VisibilityTabs';

export default VisibilityTabs;
