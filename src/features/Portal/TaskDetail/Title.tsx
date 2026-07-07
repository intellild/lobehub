import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatPortalSelectors } from '@/store/chat/selectors';
import { useTaskStore } from '@/store/task';
import { oneLineEllipsis } from '@/styles';

import styles from './Title.module.css';

const Title = memo(() => {
  const taskId = useChatStore(chatPortalSelectors.taskDetailId);
  const detail = useTaskStore((s) => (taskId ? s.taskDetailMap[taskId] : undefined));
  const identifier = detail?.identifier ?? taskId;
  const name = detail?.name;

  return (
    <Flexbox horizontal align={'center'} gap={8} style={{ minWidth: 0 }}>
      {identifier && <span className={styles.identifier}>{identifier}</span>}
      {name && (
        <Text className={oneLineEllipsis} style={{ color: 'var(--ant-color-text)', fontSize: 14 }}>
          {name}
        </Text>
      )}
    </Flexbox>
  );
});

export default Title;
