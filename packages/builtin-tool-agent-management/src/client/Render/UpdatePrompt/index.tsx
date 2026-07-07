'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { UpdatePromptParams } from '../../../types';
import styles from './index.module.css';

export const UpdatePromptRender = memo<BuiltinRenderProps<UpdatePromptParams>>(({ args }) => {
  const prompt = args?.prompt;

  if (!prompt) return null;

  return (
    <div className={styles.container}>
      <div className={styles.label}>System Prompt</div>
      <Block paddingBlock={8} paddingInline={12} variant={'outlined'} width="100%">
        <Markdown fontSize={13} variant={'chat'}>
          {prompt}
        </Markdown>
      </Block>
    </div>
  );
});

UpdatePromptRender.displayName = 'UpdatePromptRender';

export default UpdatePromptRender;
