import { type ItemType } from '@lobehub/ui';
import { Flexbox, Icon, SearchBar, stopPropagation, usePopoverContext } from '@lobehub/ui';
import { Pin, Settings, Store, Zap } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';

import styles from './PopoverContent.module.css';
import { ScrollSignalProvider } from './ScrollSignalContext';
import SkillActivateMode from './SkillActivateMode';
import ToolsList from './ToolsList';

const filterItems = (items: ItemType[], keyword: string): ItemType[] => {
  const lower = keyword.toLowerCase();

  return items
    .map((item) => {
      if (!item) return null;

      if (item.type === 'group' && 'children' in item && item.children) {
        const filtered = item.children.filter((child) => {
          if (!child) return false;
          const key = String(child.key || '').toLowerCase();
          return key.includes(lower);
        });
        if (filtered.length === 0) return null;
        return { ...item, children: filtered };
      }

      if (item.type === 'divider') return item;

      const key = String('key' in item ? item.key : '').toLowerCase();
      return key.includes(lower) ? item : null;
    })
    .filter(Boolean) as ItemType[];
};

interface PopoverContentProps {
  autoCount: number;
  items: ItemType[];
  onOpenStore: () => void;
  pinnedCount: number;
}

const PopoverContent = memo<PopoverContentProps>(
  ({ autoCount, items, onOpenStore, pinnedCount }) => {
    const { t } = useTranslation('setting');
    const navigate = useWorkspaceAwareNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');

    const { close: closePopover } = usePopoverContext();

    const filteredItems = useMemo(
      () => (searchKeyword ? filterItems(items, searchKeyword) : items),
      [items, searchKeyword],
    );

    return (
      <Flexbox gap={0}>
        <Flexbox horizontal align="center" className={styles.header} gap={4}>
          <SearchBar
            allowClear
            placeholder={t('tools.search')}
            size="small"
            style={{ flex: 1 }}
            value={searchKeyword}
            variant="borderless"
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={stopPropagation}
          />
          <SkillActivateMode />
        </Flexbox>
        <ScrollSignalProvider
          style={{
            height: 480,
            overflowY: 'auto',
          }}
        >
          <ToolsList items={filteredItems} />
        </ScrollSignalProvider>
        <div className={styles.footer}>
          <span className={styles.statsItem}>
            <Icon icon={Pin} size={12} />
            {pinnedCount}
          </span>
          <span className={styles.statsItem}>
            <Icon icon={Zap} size={12} />
            {autoCount}
          </span>
          <Flexbox horizontal align="center" gap={2} style={{ marginInlineStart: 'auto' }}>
            <button
              className={styles.storeButton}
              type="button"
              onClick={() => {
                closePopover();
                onOpenStore();
              }}
            >
              <Icon icon={Store} size={14} />
              {t('tools.addSkillOrConnector')}
            </button>
            <button
              aria-label={t('tools.plugins.management')}
              className={styles.iconButton}
              type="button"
              onClick={() => {
                closePopover();
                navigate('/settings/skill');
              }}
            >
              <Icon icon={Settings} size={14} />
            </button>
          </Flexbox>
        </div>
      </Flexbox>
    );
  },
);

PopoverContent.displayName = 'PopoverContent';

export default PopoverContent;
