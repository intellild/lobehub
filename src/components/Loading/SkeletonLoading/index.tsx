'use client';

import { Skeleton } from '@lobehub/ui';
import { type SkeletonProps } from 'antd';
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

const styles = stylesModule.root;

const SkeletonLoading = memo<SkeletonProps>(
  ({ className, classNames, styles: customStyles, ...rest }) => {
    return (
      <Skeleton
        active
        className={cx(styles, className)}
        classNames={classNames as any}
        paragraph={{ rows: 8 }}
        styles={customStyles as any}
        {...rest}
      />
    );
  },
);

export default SkeletonLoading;
