import { Avatar, Block, Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';

import { type DiscoverMcpItem } from '@/types/discover';

import styles from './Item.module.css';

const RelatedItem = memo<DiscoverMcpItem>(({ name, icon, description, identifier }) => {
  return (
    <Block horizontal gap={12} key={identifier} padding={12} variant={'outlined'}>
      <Avatar avatar={icon} shape={'square'} size={40} style={{ flex: 'none' }} />
      <Flexbox
        flex={1}
        gap={6}
        style={{
          overflow: 'hidden',
        }}
      >
        <Text ellipsis as={'h2'} className={styles.title}>
          {name}
        </Text>
        <Text
          as={'p'}
          className={styles.desc}
          ellipsis={{
            rows: 2,
          }}
        >
          {description}
        </Text>
      </Flexbox>
    </Block>
  );
});

export default RelatedItem;
