'use client';

import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { DuplicateAgentParams, DuplicateAgentState } from '../../../types';
import styles from './index.module.css';

export const DuplicateAgentRender = memo<
  BuiltinRenderProps<DuplicateAgentParams, DuplicateAgentState>
>(({ pluginState }) => {
  const { t } = useTranslation('plugin');

  if (!pluginState?.success) return null;

  return (
    <div className={styles.container}>
      <Flexbox gap={8}>
        <Flexbox gap={2}>
          <span className={styles.label}>
            {t('builtins.lobe-agent-management.render.duplicateAgent.sourceId')}
          </span>
          <span className={styles.value}>{pluginState.sourceAgentId}</span>
        </Flexbox>
        <Flexbox gap={2}>
          <span className={styles.label}>
            {t('builtins.lobe-agent-management.render.duplicateAgent.newId')}
          </span>
          <span className={styles.value}>{pluginState.newAgentId}</span>
        </Flexbox>
      </Flexbox>
    </div>
  );
});

DuplicateAgentRender.displayName = 'DuplicateAgentRender';

export default DuplicateAgentRender;
