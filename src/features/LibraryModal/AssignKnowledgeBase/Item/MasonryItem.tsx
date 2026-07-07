import { Flexbox, Icon, Text } from '@lobehub/ui';
import { LockIcon } from 'lucide-react';
import { memo } from 'react';

import KnowledgeIcon from '@/components/KnowledgeIcon';
import { type KnowledgeItem } from '@/types/knowledgeBase';

import Actions from './Action';
import styles from './MasonryItem.module.css';

const MasonryItem = memo<KnowledgeItem>(
  ({ id, fileType, name, type, description, enabled, visibility }) => {
    return (
      <div className={styles.card}>
        <Flexbox gap={12} style={{ position: 'relative' }}>
          <Flexbox horizontal align={'center'} gap={12}>
            <KnowledgeIcon
              fileType={fileType}
              name={name}
              size={{ file: 48, repo: 48 }}
              type={type}
            />
            <Flexbox flex={1} gap={6} style={{ overflow: 'hidden', position: 'relative' }}>
              <Flexbox horizontal align={'center'} gap={6}>
                {visibility === 'private' && (
                  <Icon color={'var(--ant-color-text-description)'} icon={LockIcon} size={12} />
                )}
                <Text className={styles.title} ellipsis={{ rows: 2 }}>
                  {name}
                </Text>
              </Flexbox>
            </Flexbox>
          </Flexbox>
          {description && (
            <Text className={styles.desc} ellipsis={{ rows: 3 }}>
              {description}
            </Text>
          )}
          <Flexbox align={'center'} justify={'flex-end'}>
            <Actions enabled={enabled} id={id} type={type} />
          </Flexbox>
        </Flexbox>
      </div>
    );
  },
);

MasonryItem.displayName = 'MasonryItem';

export default MasonryItem;
