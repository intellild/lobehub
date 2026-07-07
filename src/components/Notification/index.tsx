'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { ActionIcon, Flexbox } from '@lobehub/ui';
import { XIcon } from 'lucide-react';
import { memo } from 'react';

import { useIsDark } from '@/hooks/useIsDark';

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

interface NotificationProps extends FlexboxProps {
  height?: number | string;
  mobile?: boolean;
  onCancel?: (show?: boolean) => void;
  show: boolean;
  showCloseIcon?: boolean;
  width?: number | string;
  wrapper?: FlexboxProps;
}

const Notification = memo<NotificationProps>(
  ({
    mobile,
    children,
    show,
    onCancel,
    showCloseIcon = true,
    width = 422,
    height = 'auto',
    wrapper = {},
    className,
    ...rest
  }) => {
    const isDarkMode = useIsDark();
    const { className: wrapperClassName, ...restWrapper } = wrapper;
    return (
      show && (
        <Flexbox
          className={cx(styles.container, mobile && styles.mobileContainer, className)}
          height={height}
          width={mobile ? 'calc(100% - 16px)' : width}
          {...rest}
        >
          {showCloseIcon && (
            <ActionIcon className={styles.cancelIcon} icon={XIcon} onClick={() => onCancel?.()} />
          )}
          <Flexbox
            horizontal
            gap={16}
            padding={'20px 20px 16px'}
            className={cx(
              styles.wrapper,
              isDarkMode ? styles.wrapperDark : styles.wrapperLight,
              wrapperClassName,
            )}
            {...restWrapper}
          >
            {children}
          </Flexbox>
        </Flexbox>
      )
    );
  },
);

export default Notification;
