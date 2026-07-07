'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { BroadcastParams } from '../../../types';
import styles from './index.module.css';

export const BroadcastRender = memo<BuiltinRenderProps<BroadcastParams>>(({ args }) => {
  const { instruction } = args || {};

  if (!instruction) return null;

  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        <Markdown variant={'chat'}>{instruction}</Markdown>
      </div>
    </div>
  );
});

BroadcastRender.displayName = 'BroadcastRender';

export default BroadcastRender;
