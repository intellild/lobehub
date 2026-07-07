'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { SpeakParams } from '../../../types';
import styles from './index.module.css';

export const SpeakRender = memo<BuiltinRenderProps<SpeakParams>>(({ args }) => {
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

SpeakRender.displayName = 'SpeakRender';

export default SpeakRender;
