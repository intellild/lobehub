import type { UniformSearchResult } from '@lobechat/types';
import { Block, Flexbox, Text } from '@lobehub/ui';
import type { CSSProperties } from 'react';
import { memo } from 'react';

import WebFavicon from '@/components/WebFavicon';

import styles from './SearchResultItem.module.css';

const SearchResultItem = memo<UniformSearchResult & { style?: CSSProperties }>(
  ({ url, title, style }) => {
    const urlObj = new URL(url);
    const host = urlObj.hostname;
    return (
      <a href={url} target={'_blank'}>
        <Block
          clickable
          className={styles.container}
          gap={2}
          justify={'space-between'}
          style={style}
          variant={'outlined'}
        >
          <Text ellipsis={{ rows: 2 }}>{title}</Text>
          <Flexbox horizontal align={'center'} gap={4}>
            <WebFavicon size={14} title={title} url={url} />
            <Text ellipsis type={'secondary'}>
              {host.replace('www.', '')}
            </Text>
          </Flexbox>
        </Block>
      </a>
    );
  },
);

export default SearchResultItem;
