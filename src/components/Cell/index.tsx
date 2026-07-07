import { type IconProps } from '@lobehub/ui';
import { Flexbox, Icon } from '@lobehub/ui';
import { ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import Divider from './Divider';
import styles from './index.module.css';

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

export interface CellProps {
  icon?: IconProps['icon'];
  key?: string | number;
  label?: string | ReactNode;
  onClick?: () => void;
  type?: 'divider';
}

const Cell = memo<CellProps>(({ label, icon, onClick, type }) => {
  if (type === 'divider') return <Divider />;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.container)}
      gap={12}
      justify={'space-between'}
      padding={16}
      onClick={onClick}
    >
      <Flexbox horizontal align={'center'} gap={12}>
        {icon && <Icon color={'var(--ant-color-primary-border)'} icon={icon} size={{ size: 20 }} />}
        {label}
      </Flexbox>
      <Icon color={'var(--ant-color-border)'} icon={ChevronRight} size={{ size: 16 }} />
    </Flexbox>
  );
});

export default Cell;
