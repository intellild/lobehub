'use client';

import { type AnchorProps } from 'antd';
import { Anchor } from 'antd';
import { memo, useMemo } from 'react';

import { SCROLL_PARENT_ID } from '@/routes/(main)/community/features/const';
import { isOnServerSide } from '@/utils/env';

import stylesModule from './index.module.css';
import { createTOCTree } from './useToc';

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

const Toc = memo<AnchorProps>(({ items, className, ...rest }) => {
  const toc = useMemo(() => createTOCTree(items as any), [items]);

  return (
    <Anchor
      affix={false}
      className={cx(className, styles.toc)}
      items={toc}
      getContainer={
        isOnServerSide ? undefined : () => document.querySelector(`#${SCROLL_PARENT_ID}`) as any
      }
      {...rest}
    />
  );
});

export default Toc;
