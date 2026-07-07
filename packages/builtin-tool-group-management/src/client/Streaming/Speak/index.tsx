'use client';

import type { BuiltinStreamingProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { SpeakParams } from '../../../types';
import styles from './index.module.css';

export const SpeakStreaming = memo<BuiltinStreamingProps<SpeakParams>>(({ args }) => {
  const { instruction } = args || {};

  if (!instruction) return null;

  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        <Markdown animated variant={'chat'}>
          {instruction}
        </Markdown>
      </div>
    </div>
  );
});

SpeakStreaming.displayName = 'SpeakStreaming';

export default SpeakStreaming;
