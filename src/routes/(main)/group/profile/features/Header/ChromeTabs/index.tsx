'use client';

import { Avatar, DropdownMenu, Flexbox, type MenuProps, Tooltip } from '@lobehub/ui';
import { Plus } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import stylesModule from './index.module.css';

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

const styles = stylesModule;

export interface ChromeTabItem {
  avatar?: string;
  icon?: ReactNode;
  id: string;
  isExternal?: boolean;
  title: string;
}

interface ChromeTabsProps {
  activeId: string;
  addDisabled?: boolean;
  addDisabledReason?: string;
  /**
   * When provided, the add button becomes a dropdown trigger showing these items.
   * Otherwise it falls back to calling `onAdd` directly on click.
   */
  addMenuItems?: MenuProps['items'];
  items: ChromeTabItem[];
  onAdd?: () => void;
  onChange: (id: string) => void;
}

const ChromeTabs = memo<ChromeTabsProps>(
  ({ items, activeId, onChange, onAdd, addMenuItems, addDisabled, addDisabledReason }) => {
    const { t } = useTranslation('chat');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current || !activeId) return;

      const activeTab = containerRef.current.querySelector(`[data-tab-id="${activeId}"]`);
      if (!activeTab) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const isVisible = tabRect.left >= containerRect.left && tabRect.right <= containerRect.right;

      if (!isVisible) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }, [activeId]);

    return (
      <div className={styles.container} ref={containerRef}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <div
              className={cx(styles.tab, isActive && styles.tabActive)}
              data-tab-id={item.id}
              key={item.id}
              onClick={() => onChange(item.id)}
            >
              <Flexbox horizontal align="center" gap={6}>
                {item.icon ? (
                  item.icon
                ) : item.avatar ? (
                  <Avatar avatar={item.avatar} size={18} />
                ) : null}
                <span className={styles.tabTitle}>{item.title}</span>
                {item.isExternal && (
                  <span className={styles.externalTag}>{t('group.profile.external')}</span>
                )}
              </Flexbox>
            </div>
          );
        })}
        {(addMenuItems || onAdd) &&
          (addMenuItems ? (
            <DropdownMenu
              disabled={addDisabled}
              items={addMenuItems}
              nativeButton={false}
              placement="bottomLeft"
              trigger={['click']}
            >
              <div
                className={cx(styles.addButton, addDisabled && styles.addButtonDisabled)}
                title={addDisabled ? addDisabledReason : undefined}
              >
                <Plus size={16} />
              </div>
            </DropdownMenu>
          ) : (
            <Tooltip title={addDisabled ? addDisabledReason : undefined}>
              <div
                className={cx(styles.addButton, addDisabled && styles.addButtonDisabled)}
                onClick={() => {
                  if (addDisabled) return;
                  onAdd?.();
                }}
              >
                <Plus size={16} />
              </div>
            </Tooltip>
          ))}
      </div>
    );
  },
);

export default ChromeTabs;
