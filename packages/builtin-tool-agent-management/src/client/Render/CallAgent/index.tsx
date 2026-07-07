'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { CallAgentParams } from '../../../types';
import styles from './index.module.css';

export const CallAgentRender = memo<BuiltinRenderProps<CallAgentParams>>(({ args }) => {
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

CallAgentRender.displayName = 'CallAgentRender';

export default CallAgentRender;
