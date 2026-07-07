import { Center, Icon } from '@lobehub/ui';
import { type LucideIcon } from 'lucide-react';
import { memo } from 'react';

import styles from './index.module.css';

const GroupIcon = memo<{ icon: LucideIcon }>(({ icon }) => {
  return (
    <Center className={styles.icon} flex={'none'} height={40} width={40}>
      <Icon icon={icon} size={24} />
    </Center>
  );
});

export default GroupIcon;
