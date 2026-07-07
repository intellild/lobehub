'use client';

import { type BuiltinRenderProps } from '@lobechat/types';
import { Flexbox, Markdown, ScrollShadow } from '@lobehub/ui';
import { memo } from 'react';

import type { ActivateSkillParams, ActivateSkillState } from '../../../types';
import styles from './index.module.css';

const RunSkill = memo<BuiltinRenderProps<ActivateSkillParams, ActivateSkillState>>(
  ({ content, pluginState }) => {
    const { description, name, title } = pluginState || {};
    const displayName = title || name;

    if (!displayName) return null;

    return (
      <Flexbox className={styles.container}>
        <Flexbox className={styles.header} gap={4}>
          <span className={styles.name}>{displayName}</span>
          {description && <span className={styles.description}>{description}</span>}
        </Flexbox>
        {content && (
          <ScrollShadow className={styles.content} offset={12} size={12} style={{ maxHeight: 400 }}>
            <Markdown style={{ overflow: 'unset' }} variant={'chat'}>
              {content}
            </Markdown>
          </ScrollShadow>
        )}
      </Flexbox>
    );
  },
);

export default RunSkill;
