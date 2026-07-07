'use client';

import { ActionIcon, Flexbox, Icon } from '@lobehub/ui';
import { Pin, PinOff } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useElectronStore } from '@/store/electron';

import { type ResolvedTab } from '../TabBar/hooks/useResolvedTabs';
import { isSameTabTarget } from '../TabBar/scope';
import { useStyles } from './styles';

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

interface PageItemProps {
  isPinned: boolean;
  item: ResolvedTab;
  onClose: () => void;
}

const PageItem = memo<PageItemProps>(({ item, isPinned, onClose }) => {
  const { t } = useTranslation('electron');
  const navigate = useWorkspaceAwareNavigate();
  const location = useLocation();
  const styles = useStyles;

  const pinPage = useElectronStore((s) => s.pinPage);
  const unpinPage = useElectronStore((s) => s.unpinPage);

  const { meta, tab } = item;
  const currentUrl = location.pathname + location.search;
  const isActive = isSameTabTarget(tab, currentUrl);

  const handleClick = () => {
    navigate(tab.url, { escape: true });
    onClose();
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned) {
      unpinPage(tab.id);
    } else {
      pinPage(tab);
    }
  };

  return (
    <Flexbox
      horizontal
      align="center"
      className={cx(styles.item, isActive && styles.itemActive)}
      gap={8}
      onClick={handleClick}
    >
      {meta.icon && <Icon className={styles.icon} icon={meta.icon} size="small" />}
      <span className={styles.itemTitle}>{meta.title}</span>
      <ActionIcon
        className={cx('actionIcon', styles.actionIcon)}
        icon={isPinned ? PinOff : Pin}
        size="small"
        title={isPinned ? t('navigation.unpin') : t('navigation.pin')}
        onClick={handlePinToggle}
      />
    </Flexbox>
  );
});

PageItem.displayName = 'PageItem';

export default PageItem;
