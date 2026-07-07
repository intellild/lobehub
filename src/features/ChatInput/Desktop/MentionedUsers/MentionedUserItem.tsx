import { Avatar, Center, Flexbox, Text } from '@lobehub/ui';
import { X } from 'lucide-react';
import { memo } from 'react';

import { useMentionStore } from '@/store/mention';

import styles from './MentionedUserItem.module.css';

interface MentionedUserItemProps {
  agent: any; // The actual agent data from the group
}

const MentionedUserItem = memo<MentionedUserItemProps>(({ agent }) => {
  const removeMentionedUser = useMentionStore((s) => s.removeMentionedUser);

  const handleRemove = () => {
    removeMentionedUser(agent.id);
  };

  return (
    <Flexbox horizontal align={'center'} className={styles.container}>
      <Center flex={1} height={64} padding={4} style={{ maxWidth: 64 }}>
        <Avatar
          avatar={agent.avatar}
          background={agent.backgroundColor}
          shape={'square'}
          size={48}
        />
      </Center>
      <Flexbox flex={1} gap={4} style={{ paddingBottom: 4, paddingInline: 4 }}>
        <Text ellipsis={{ tooltip: true }} style={{ fontSize: 12, maxWidth: 100 }}>
          {agent.title || agent.id}
        </Text>
        <Text style={{ fontSize: 10 }} type="secondary">
          @{agent.id}
        </Text>
      </Flexbox>
      <div className={styles.removeButton} onClick={handleRemove}>
        <X size={12} />
      </div>
    </Flexbox>
  );
});

export default MentionedUserItem;
