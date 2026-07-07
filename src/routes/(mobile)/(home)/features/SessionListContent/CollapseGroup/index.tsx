import { Icon } from '@lobehub/ui';
import { type CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { ChevronDown } from 'lucide-react';
import { memo } from 'react';

import stylesModule from './index.module.css';

const prefixCls = 'ant';
const styles = stylesModule;

const CollapseGroup = memo<CollapseProps>((props) => {
  return (
    <Collapse
      ghost
      bordered={false}
      className={styles.container}
      expandIconPlacement={'end'}
      size={'small'}
      expandIcon={({ isActive }) => (
        <Icon
          className={styles.icon}
          icon={ChevronDown}
          size={16}
          style={isActive ? {} : { rotate: '-90deg' }}
        />
      )}
      {...props}
    />
  );
});

export default CollapseGroup;
