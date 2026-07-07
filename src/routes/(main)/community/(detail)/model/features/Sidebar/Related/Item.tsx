import { ModelIcon } from '@lobehub/icons';
import { Block, Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type DiscoverModelItem } from '@/types/discover';

import styles from './Item.module.css';

const RelatedItem = memo<DiscoverModelItem>(({ description, identifier, displayName }) => {
  const { t } = useTranslation('models');
  return (
    <Block horizontal gap={12} key={identifier} padding={12} variant={'outlined'}>
      <ModelIcon model={identifier} size={40} style={{ flex: 'none' }} type={'avatar'} />
      <Flexbox
        flex={1}
        gap={6}
        style={{
          overflow: 'hidden',
        }}
      >
        <Text ellipsis as={'h2'} className={styles.title}>
          {displayName || identifier}
        </Text>
        <Text
          as={'p'}
          className={styles.desc}
          ellipsis={{
            rows: 2,
          }}
        >
          {t(`${identifier}.description`, { defaultValue: description })}
        </Text>
      </Flexbox>
    </Block>
  );
});

export default RelatedItem;
