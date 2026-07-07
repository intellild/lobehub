import { Icon } from '@lobehub/ui';
import { FolderIcon } from 'lucide-react';
import { memo } from 'react';

interface LibIconProps {
  size?: number;
}
const LibIcon = memo<LibIconProps>(({ size = 20 }) => {
  return <Icon color={'var(--ant-geekblue)'} fill={'var(--ant-geekblue-3)'} icon={FolderIcon} size={size} />;
});

export default LibIcon;
