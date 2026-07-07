'use client';

import type { BuiltinStreamingProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { CallSubAgentParams } from '../../../types';
import styles from './index.module.css';

export const CallSubAgentStreaming = memo<BuiltinStreamingProps<CallSubAgentParams>>(({ args }) => {
  const { instruction } = args || {};

  if (!instruction) return null;

  return (
    <div className={styles.container}>
      {instruction && (
        <div className={styles.instruction}>
          <Markdown animated variant={'chat'}>
            {instruction}
          </Markdown>
        </div>
      )}
    </div>
  );
});

CallSubAgentStreaming.displayName = 'CallSubAgentStreaming';

export default CallSubAgentStreaming;
