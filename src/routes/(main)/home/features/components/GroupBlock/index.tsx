import { type FlexboxProps, type IconProps } from '@lobehub/ui';
import { Flexbox, Icon, Text } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo, Suspense, useState } from 'react';

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

interface GroupBlockProps extends Omit<FlexboxProps, 'title'> {
  action?: ReactNode;
  actionAlwaysVisible?: boolean;
  icon?: IconProps['icon'];
  title?: ReactNode;
}

const GroupBlock = memo<GroupBlockProps>(
  ({ title, action, actionAlwaysVisible, children, icon, ...rest }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Flexbox
        gap={16}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...rest}
      >
        <Flexbox horizontal align={'center'} justify={'space-between'}>
          <Flexbox
            horizontal
            align={'center'}
            flex={1}
            gap={8}
            justify={'flex-start'}
            style={{ overflow: 'hidden' }}
          >
            <Icon color={'var(--ant-color-text-description)'} icon={icon} size={18} />
            <Text ellipsis color={'var(--ant-color-text-secondary)'}>
              {title}
            </Text>
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            flex={'none'}
            gap={2}
            justify={'flex-end'}
            className={cx(
              styles.action,
              (isHovered || actionAlwaysVisible) && styles.actionVisible,
            )}
          >
            {action}
          </Flexbox>
        </Flexbox>
        <Suspense fallback={'loading'}>{children}</Suspense>
      </Flexbox>
    );
  },
);

export default GroupBlock;
