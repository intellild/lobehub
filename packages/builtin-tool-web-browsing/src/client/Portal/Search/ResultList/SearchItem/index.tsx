import type { UniformSearchResult } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';

import WebFavicon from '@/components/WebFavicon';

import styles from './index.module.css';
import TitleExtra from './TitleExtra';
import Video from './Video';

interface SearchResultProps extends UniformSearchResult {
  highlight?: boolean;
}

const SearchItem = memo<SearchResultProps>((props) => {
  const { content, url, score, engines, title, category } = props;

  if (category === 'videos') return <Video {...props} />;

  return (
    <a className={styles.container} href={url!} rel="noreferrer" target={'_blank'}>
      <Flexbox distribution={'space-between'} flex={1} gap={8} padding={12}>
        <Flexbox gap={8}>
          <Flexbox horizontal align={'center'} distribution={'space-between'}>
            <Flexbox horizontal align={'center'} gap={8}>
              <WebFavicon title={title} url={url} />
              <Flexbox className={styles.title}>{title}</Flexbox>
            </Flexbox>
            <TitleExtra
              category={category}
              engines={engines}
              highlight={props.highlight}
              score={score}
            />
          </Flexbox>
          <Text className={styles.url} type={'secondary'}>
            {url}
          </Text>
          <Flexbox className={styles.desc}>{content}</Flexbox>
        </Flexbox>
      </Flexbox>
    </a>
  );
});

export default SearchItem;
