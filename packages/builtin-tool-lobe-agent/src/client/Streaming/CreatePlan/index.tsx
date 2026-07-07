'use client';

import type { BuiltinStreamingProps } from '@lobechat/types';
import { Flexbox, Icon, Text } from '@lobehub/ui';
import { ListChecksIcon } from 'lucide-react';
import { memo } from 'react';

import StreamingMarkdown from '@/components/StreamingMarkdown';

import type { CreatePlanParams } from '../../../types';
import styles from './index.module.css';

export const CreatePlanStreaming = memo<BuiltinStreamingProps<CreatePlanParams>>(({ args }) => {
  const { goal, description, context } = args || {};

  if (!goal) return null;

  return (
    <Flexbox className={styles.container} gap={8}>
      {/* Header */}
      <div className={styles.header}>
        <Icon icon={ListChecksIcon} size={18} />
        <Text ellipsis className={styles.title}>
          {goal}
        </Text>
      </div>

      {/* Description */}
      {description && (
        <Text className={styles.description} ellipsis={{ rows: 2 }}>
          {description}
        </Text>
      )}

      {/* Context content - streaming with animation */}
      <StreamingMarkdown maxHeight={100}>{context}</StreamingMarkdown>
    </Flexbox>
  );
});

CreatePlanStreaming.displayName = 'CreatePlanStreaming';

export default CreatePlanStreaming;
