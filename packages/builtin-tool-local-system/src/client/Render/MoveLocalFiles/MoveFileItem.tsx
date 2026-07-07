import { useToolRenderCapabilities } from '@lobechat/shared-tool-ui';
import { Flexbox, Icon, Text } from '@lobehub/ui';
import { ArrowRight } from 'lucide-react';
import { memo } from 'react';

import styles from './MoveFileItem.module.css';

interface MoveFileItemProps {
  newPath: string;
  oldPath: string;
}

const MoveFileItem = memo<MoveFileItemProps>(({ oldPath, newPath }) => {
  const { displayRelativePath } = useToolRenderCapabilities();
  const displayOldPath = displayRelativePath ? displayRelativePath(oldPath) : oldPath;
  const displayNewPath = displayRelativePath ? displayRelativePath(newPath) : newPath;

  return (
    <Flexbox horizontal align="center" className={styles.item} gap={8} width="100%">
      <Flexbox flex={1}>
        <Text className={styles.path} type="secondary">
          {displayOldPath}
        </Text>
      </Flexbox>
      <Icon className={styles.icon} icon={ArrowRight} />
      <Flexbox flex={2}>
        <Text className={styles.path}>{displayNewPath}</Text>
      </Flexbox>
    </Flexbox>
  );
});

export default MoveFileItem;
