import { Avatar, Icon } from '@lobehub/ui';
import { type LucideIcon } from 'lucide-react';
import { memo } from 'react';

interface ServerIconProps {
  icon: string | LucideIcon;
  label: string;
}

const ServerIcon = memo<ServerIconProps>(({ icon, label }) => {
  if (typeof icon === 'string') {
    return <Avatar alt={label} avatar={icon} shape={'square'} size={24} style={{ flex: 'none' }} />;
  }

  return <Icon fill={'var(--ant-color-text)'} icon={icon} size={24} />;
});

ServerIcon.displayName = 'ServerIcon';

export default ServerIcon;
