import { type MenuProps as AntdMenuProps } from 'antd';
import { ConfigProvider, Menu as AntdMenu } from 'antd';
import { memo } from 'react';

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

const prefixCls = 'ant';
const styles = stylesModule;

export interface MenuProps extends AntdMenuProps {
  compact?: boolean;
}

const Menu = memo<MenuProps>(({ className, selectable = false, compact, ...rest }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            controlHeightLG: 36,
            iconMarginInlineEnd: 8,
            iconSize: 16,
            itemBorderRadius: 8,
            itemColor: selectable ? 'var(--ant-color-text-secondary)' : 'var(--ant-color-text)',
            itemHoverBg: 'var(--ant-color-fill-tertiary)',
            itemMarginBlock: compact ? 0 : 4,
            itemMarginInline: compact ? 0 : 4,
            itemSelectedBg: 'var(--ant-color-fill-secondary)',
            paddingXS: -8,
          },
        },
      }}
    >
      <AntdMenu
        className={cx(styles.menu, compact && styles.compact, className)}
        mode="vertical"
        selectable={selectable}
        {...rest}
      />
    </ConfigProvider>
  );
});

export default Menu;
