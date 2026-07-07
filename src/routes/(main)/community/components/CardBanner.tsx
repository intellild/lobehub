import { type DivProps } from '@lobehub/ui';
import { Avatar, Flexbox } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo } from 'react';

import styles from './CardBanner.module.css';

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

export { styles };

interface CardBannerProps extends DivProps {
  avatar?: string | ReactNode;
  loading?: boolean;
  mask?: boolean;
  maskColor?: string;
  size?: number;
}

const CardBanner = memo<CardBannerProps>(
  ({ avatar, className, size = 600, children, ...props }) => {
    return (
      <Flexbox
        align={'center'}
        className={cx(styles.banner, className)}
        justify={'center'}
        style={avatar ? {} : { backgroundColor: 'var(--ant-color-fill-tertiary)' }}
        width={'100%'}
        {...props}
      >
        {avatar && (
          <Avatar
            alt={'banner'}
            avatar={avatar}
            className={styles.bannerImg}
            shape={'square'}
            size={size}
          />
        )}
        {children}
      </Flexbox>
    );
  },
);

export default CardBanner;
