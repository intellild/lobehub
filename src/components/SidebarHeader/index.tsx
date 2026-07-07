import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo } from 'react';

import styles from './index.module.css';

interface SidebarHeaderProps extends Omit<FlexboxProps, 'title'> {
  actions?: ReactNode;
  onClick?: () => void;
  title: ReactNode;
}

const SidebarHeader = memo<SidebarHeaderProps>(({ title, style, actions, onClick, ...rest }) => {
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={styles.header}
      distribution={'space-between'}
      flex={'none'}
      padding={8}
      style={style}
      onClick={onClick}
      {...rest}
    >
      <Flexbox horizontal align={'center'} gap={4} width={'100%'}>
        {title}
      </Flexbox>
      <Flexbox horizontal align={'center'} gap={2}>
        {actions}
      </Flexbox>
    </Flexbox>
  );
});

export default SidebarHeader;
