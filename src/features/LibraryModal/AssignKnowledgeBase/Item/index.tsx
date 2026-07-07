import { Flexbox, Icon, Text } from '@lobehub/ui';
import { LockIcon } from 'lucide-react';
import { memo } from 'react';

import KnowledgeIcon from '@/components/KnowledgeIcon';
import { type KnowledgeItem } from '@/types/knowledgeBase';

import Actions from './Action';
import styles from './index.module.css';

const PluginItem = memo<KnowledgeItem>(
  ({ id, fileType, name, type, description, enabled, visibility }) => {
    return (
      <Flexbox
        horizontal
        align={'center'}
        gap={8}
        justify={'space-between'}
        paddingBlock={12}
        paddingInline={16}
        style={{ position: 'relative' }}
      >
        <Flexbox
          horizontal
          align={'center'}
          flex={1}
          gap={8}
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          <KnowledgeIcon
            fileType={fileType}
            name={name}
            size={{ file: 40, repo: 40 }}
            type={type}
          />
          <Flexbox flex={1} gap={4} style={{ overflow: 'hidden', position: 'relative' }}>
            <Flexbox horizontal align={'center'} gap={6}>
              {visibility === 'private' && (
                <Icon color={'var(--ant-color-text-description)'} icon={LockIcon} size={12} />
              )}
              <Text ellipsis className={styles.title}>
                {name}
              </Text>
            </Flexbox>
            {description && (
              <Text ellipsis className={styles.desc}>
                {description}
              </Text>
            )}
          </Flexbox>
        </Flexbox>
        <Actions enabled={enabled} id={id} type={type} />
      </Flexbox>
    );
  },
);

export default PluginItem;
