'use client';

import { Menu, type MenuProps, Text } from '@lobehub/ui';
import { memo } from 'react';

import styles from './Sidebar.module.css';

interface SidebarProps {
  items: MenuProps['items'];
  onSelect: (key: string) => void;
  selectedKey?: string;
}

const Sidebar = memo<SidebarProps>(({ items, selectedKey, onSelect }) => (
  <aside className={styles.sidebar}>
    <div className={styles.header}>
      <Text fontSize={13} type={'secondary'} weight={600}>
        Builtin Tool Renders
      </Text>
    </div>
    <div className={styles.scroll}>
      <Menu
        className={styles.menu}
        items={items}
        mode={'inline'}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onClick={({ key }) => onSelect(key)}
      />
    </div>
  </aside>
));

export default Sidebar;
