import { Avatar, Center, Icon } from '@lobehub/ui';
import { CircleUser } from 'lucide-react';
import { memo } from 'react';

import { useAgentDisplayMeta } from '../shared/useAgentDisplayMeta';

interface AssigneeAvatarProps {
  agentId?: string | null;
  fallbackToDefault?: boolean;
  size?: number;
}

const AssigneeAvatar = memo<AssigneeAvatarProps>(({ agentId, fallbackToDefault, size = 18 }) => {
  const displayMeta = useAgentDisplayMeta(agentId, { fallbackToDefault });

  if (!displayMeta) {
    return (
      <Center
        height={size}
        width={size}
        style={{
          borderRadius: '50%',
          color: 'var(--ant-color-text-quaternary)',
          flexShrink: 0,
        }}
      >
        <Icon icon={CircleUser} size={size} />
      </Center>
    );
  }

  return (
    <Avatar
      avatar={displayMeta.avatar}
      background={displayMeta.backgroundColor || 'var(--ant-color-bg-container)'}
      shape={'circle'}
      size={size}
      title={displayMeta.title}
      variant={'outlined'}
    />
  );
});

export default AssigneeAvatar;
