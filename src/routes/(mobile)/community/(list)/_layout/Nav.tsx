'use client';

import { ActionIcon, Flexbox } from '@lobehub/ui';
import { Drawer } from 'antd';
import { MenuIcon } from 'lucide-react';
import { memo, useState } from 'react';

import Menu from '@/components/Menu';
import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { DiscoverTab } from '@/types/discover';

import { useNav } from '../../../../(main)/community/features/useNav';
import styles from './Nav.module.css';

const SCROLL_CONTAINER_ID = 'lobe-mobile-scroll-container';

const scrollToTop = () => {
  const scrollableElement = document?.querySelector(`#${SCROLL_CONTAINER_ID}`);

  if (!scrollableElement) return;
  scrollableElement.scrollTo({ behavior: 'smooth', top: 0 });
};
export { styles };

const Nav = memo(() => {
  const [open, setOpen] = useState(false);
  const { items, activeKey, activeItem } = useNav();
  const navigate = useWorkspaceAwareNavigate();

  return (
    <>
      <Flexbox horizontal align={'center'} className={styles.title} gap={4}>
        <ActionIcon
          color={'var(--ant-color-text)'}
          icon={MenuIcon}
          size={{ blockSize: 32, size: 18 }}
          onClick={() => {
            setOpen(true);
          }}
        />
        {activeItem?.label}
      </Flexbox>

      <Drawer
        headerStyle={{ display: 'none' }}
        open={open}
        placement={'left'}
        rootStyle={{ position: 'absolute' }}
        width={260}
        zIndex={10}
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          justifyContent: 'space-between',
          padding: 16,
        }}
        style={{
          background: 'var(--ant-color-bg-layout)',
          borderRight: `1px solid ${'var(--ant-color-split)'}`,
          paddingTop: 44,
        }}
        onClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <Menu
          compact
          selectable
          items={items}
          selectedKeys={[activeKey]}
          onClick={({ key }) => {
            scrollToTop();
            if (key === DiscoverTab.Home) {
              navigate('/community');
            } else {
              navigate(`/community/${key}`);
            }
          }}
        />
      </Drawer>
    </>
  );
});

export default Nav;
