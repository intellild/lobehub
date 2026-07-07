'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { type PropsWithChildren, type ReactNode } from 'react';
import { memo } from 'react';

import { useTheme } from '@/hooks/useTheme';

interface SettingContainerProps extends FlexboxProps {
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;
  maxWidth?: number | string;
  variant?: 'default' | 'secondary';
}
const SettingContainer = memo<PropsWithChildren<SettingContainerProps>>(
  ({ variant, maxWidth = 1024, children, addonAfter, addonBefore, style, ...rest }) => {
    const theme = useTheme(); // Keep for colorBgContainerSecondary, which is applied dynamically.
    return (
      <Flexbox
        align={'center'}
        height={'100%'}
        width={'100%'}
        style={{
          background:
            variant === 'secondary' ? theme.colorBgContainerSecondary : 'var(--ant-color-bg-container)',
          overflowX: 'hidden',
          overflowY: 'auto',
          ...style,
        }}
        {...rest}
      >
        {addonBefore}
        <Flexbox
          flex={1}
          gap={36}
          width={'100%'}
          style={{
            maxWidth,
          }}
        >
          {children}
        </Flexbox>
        {addonAfter}
      </Flexbox>
    );
  },
);

export default SettingContainer;
