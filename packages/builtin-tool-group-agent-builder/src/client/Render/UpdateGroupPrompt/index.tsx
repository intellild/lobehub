'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import type { UpdateGroupPromptParams, UpdateGroupPromptState } from '../../../types';
import styles from './index.module.css';

export const UpdateGroupPromptRender = memo<
  BuiltinRenderProps<UpdateGroupPromptParams, UpdateGroupPromptState>
>(({ pluginState }) => {
  const prompt = pluginState?.newPrompt;

  if (!prompt) return null;

  return (
    <div className={styles.container}>
      <div>
        <Markdown variant={'chat'}>{prompt}</Markdown>
      </div>
    </div>
  );
});

UpdateGroupPromptRender.displayName = 'UpdateGroupPromptRender';

export default UpdateGroupPromptRender;
