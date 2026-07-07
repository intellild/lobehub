'use client';

import { type PopoverProps } from '@lobehub/ui';
import { Flexbox, Popover } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo, Suspense } from 'react';

import DebugNode from '@/components/DebugNode';
import UpdateLoading from '@/components/Loading/UpdateLoading';
import { useIsMobile } from '@/hooks/useIsMobile';

import stylesModule from './ActionPopover.module.css';

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

export interface ActionPopoverProps extends Omit<PopoverProps, 'title' | 'content' | 'children'> {
  children?: ReactNode;
  content?: ReactNode;
  extra?: ReactNode;
  loading?: boolean;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  title?: ReactNode;
}

const ActionPopover = memo<ActionPopoverProps>(
  ({
    styles: customStyles,
    maxHeight,
    maxWidth,
    minWidth,
    children,
    classNames: customClassNames,
    title,
    placement,
    loading,
    extra,
    content,
    ...rest
  }) => {
    const isMobile = useIsMobile();

    // Properly handle classNames (can be object or function)
    const resolvedClassNames =
      typeof customClassNames === 'function' ? customClassNames : customClassNames;
    const contentClassName =
      typeof resolvedClassNames === 'object' && resolvedClassNames?.content
        ? cx(styles.popoverContent, resolvedClassNames.content)
        : styles.popoverContent;

    // Properly handle styles (can be object or function)
    const resolvedStyles = typeof customStyles === 'function' ? customStyles : customStyles;
    const contentStyle =
      typeof resolvedStyles === 'object' && resolvedStyles?.content ? resolvedStyles.content : {};

    // Compose content with optional title
    const popoverContent = (
      <Suspense fallback={<DebugNode trace="ActionPopover > content" />}>
        <>
          {title && (
            <Flexbox horizontal gap={8} justify={'space-between'} style={{ marginBottom: 16 }}>
              {title}
              {extra}
              {loading && <UpdateLoading style={{ color: 'var(--ant-color-text-secondary)' }} />}
            </Flexbox>
          )}
          {content}
        </>
      </Suspense>
    );

    return (
      <Popover
        content={popoverContent}
        nativeButton={false}
        placement={isMobile ? 'top' : placement}
        classNames={{
          ...(typeof resolvedClassNames === 'object' ? resolvedClassNames : {}),
          content: contentClassName,
        }}
        styles={{
          ...(typeof resolvedStyles === 'object' ? resolvedStyles : {}),
          content: {
            maxHeight,
            maxWidth: isMobile ? undefined : maxWidth,
            minWidth: isMobile ? undefined : minWidth,
            width: isMobile ? '100vw' : undefined,
            ...contentStyle,
          },
        }}
        {...rest}
      >
        {children}
      </Popover>
    );
  },
);

export default ActionPopover;
