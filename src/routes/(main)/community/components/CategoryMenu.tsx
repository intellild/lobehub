'use client';

import { type MenuProps } from '@lobehub/ui';
import { Menu } from '@lobehub/ui';
import { memo } from 'react';

import stylesModule from './CategoryMenu.module.css';

const prefixCls = 'ant';
const styles = stylesModule;

const CategoryMenu = memo<MenuProps>(({ style, ...rest }) => {
  return (
    <Menu
      className={styles.menu}
      data-testid="category-menu"
      mode="inline"
      style={style}
      {...rest}
    />
  );
});

export default CategoryMenu;
