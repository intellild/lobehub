import type { BuiltinRenderProps } from '@lobechat/types';
import { Flexbox } from '@lobehub/ui';
import { CheckCircle, FileText } from 'lucide-react';
import { memo } from 'react';

import type { UpdatePromptParams, UpdatePromptState } from '../../types';
import styles from './UpdatePrompt.module.css';

const UpdatePrompt = memo<BuiltinRenderProps<UpdatePromptParams, UpdatePromptState>>(
  ({ pluginState }) => {
    const { newPrompt } = pluginState || {};

    return (
      <Flexbox className={styles.container} gap={8}>
        <Flexbox horizontal align={'center'} className={styles.statusRow} gap={6}>
          <CheckCircle size={14} />
          <span className={styles.statusText}>
            {newPrompt ? 'System prompt updated' : 'System prompt cleared'}
          </span>
        </Flexbox>

        {newPrompt && (
          <Flexbox className={styles.promptCard} gap={8}>
            <Flexbox horizontal align={'center'} gap={6}>
              <FileText className={styles.fileIcon} size={14} />
              <span className={styles.promptLabel}>
                New prompt ({newPrompt.length} characters):
              </span>
            </Flexbox>
            <div className={styles.promptContent}>
              {newPrompt.length > 500 ? newPrompt.slice(0, 500) + '...' : newPrompt}
            </div>
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);

export default UpdatePrompt;
