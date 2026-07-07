'use client';

import { type BuiltinRenderProps } from '@lobechat/types';
import { Block, Flexbox, Highlighter } from '@lobehub/ui';
import { memo } from 'react';

import type { ExecScriptParams, ExecScriptState } from '../../../types';
import styles from './index.module.css';

const ExecScript = memo<BuiltinRenderProps<ExecScriptParams, ExecScriptState>>(
  ({ args, content, pluginState }) => {
    const { command } = pluginState || {};

    return (
      <Flexbox className={styles.container} gap={8}>
        <Block gap={8} padding={8} variant={'outlined'}>
          <Highlighter
            wrap
            language={'sh'}
            showLanguage={false}
            style={{ paddingInline: 8 }}
            variant={'borderless'}
          >
            {args?.command || command || ''}
          </Highlighter>
          {content && (
            <Highlighter wrap language={'text'} showLanguage={false} variant={'filled'}>
              {content}
            </Highlighter>
          )}
        </Block>
      </Flexbox>
    );
  },
);

export default ExecScript;
