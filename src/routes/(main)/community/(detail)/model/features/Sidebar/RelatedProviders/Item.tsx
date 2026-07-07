import { ProviderIcon } from '@lobehub/icons';
import { Block, Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { type DiscoverModelDetailProviderItem } from '@/types/discover';

import styles from './Item.module.css';

const RelatedItem = memo<DiscoverModelDetailProviderItem>(({ description, id, name }) => {
  const { t } = useTranslation('providers');
  return (
    <Block horizontal gap={12} key={id} padding={12} variant={'outlined'}>
      <ProviderIcon provider={id} size={40} style={{ flex: 'none' }} type={'avatar'} />
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
          {t(`${id}.description`, { defaultValue: description })}
        </Text>
      </Flexbox>
    </Block>
  );
});

export default RelatedItem;
