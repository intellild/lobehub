import { type CenterProps } from '@lobehub/ui';
import { Avatar, Center, Flexbox } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo } from 'react';

import styles from './style.module.css';

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

export const ErrorActionContainer = memo<CenterProps>(
  ({ children, className, gap = 24, padding = 24, ...rest }) => {
    return (
      <Center className={cx(styles.container, className)} gap={gap} padding={padding} {...rest}>
        {children}
      </Center>
    );
  },
);

export const FormAction = memo<
  {
    animation?: boolean;
    avatar: ReactNode;
    background?: string;
    description: string;
    title: string;
  } & CenterProps
>(
  ({
    children,
    background,
    title,
    description,
    avatar,
    animation,
    className,
    gap = 16,
    ...rest
  }) => {
    return (
      <Center className={cx(styles.form, className)} gap={gap} {...rest}>
        <Avatar
          animation={animation}
          avatar={avatar}
          background={background ?? 'var(--ant-color-fill-content)'}
          gap={12}
          shape={'square'}
          size={80}
        />
        <Flexbox gap={8} width={'100%'}>
          <Flexbox style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            {title}
          </Flexbox>
          <Flexbox className={styles.desc}>{description}</Flexbox>
        </Flexbox>
        {children}
      </Center>
    );
  },
);
