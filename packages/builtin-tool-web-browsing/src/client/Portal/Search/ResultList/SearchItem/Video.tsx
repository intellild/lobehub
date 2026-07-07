import type { UniformSearchResult } from '@lobechat/types';
import { Avatar, Flexbox, Text } from '@lobehub/ui';
import { memo, useState } from 'react';

import { ENGINE_ICON_MAP } from '../../../../../const';
import TitleExtra from './TitleExtra';
import styles from './Video.module.css';

interface SearchResultProps extends UniformSearchResult {
  highlight?: boolean;
}
const VideoItem = memo<SearchResultProps>(
  ({ content, url, iframeSrc, highlight, score, engines, title, category, ...res }) => {
    const [expand, setExpand] = useState(false);

    const videoUrl = iframeSrc || (res as any).iframe_src; // iframe_src is a SearchXNG field, for backward compatibility with old data structure
    return (
      <Flexbox gap={12}>
        <Flexbox className={styles.container} onClick={() => setExpand(!expand)}>
          <Flexbox horizontal flex={1} gap={8} padding={12}>
            {videoUrl && (
              <Flexbox>
                <iframe
                  // alt={title}
                  className={styles.iframe}
                  height={100}
                  src={videoUrl}
                  width={200}
                  style={{
                    pointerEvents: 'none',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPlay={(e) => {
                    e.preventDefault();
                  }}
                />
              </Flexbox>
            )}
            <Flexbox flex={1} gap={8}>
              <Flexbox horizontal align={'center'} distribution={'space-between'} gap={12}>
                <Flexbox horizontal align={'center'} gap={8}>
                  <Avatar.Group
                    shape={'circle'}
                    size={20}
                    items={engines.map((engine) => ({
                      avatar: ENGINE_ICON_MAP[engine],
                      background: 'var(--ant-color-bg-layout)',
                      key: engine,
                      title: engine,
                    }))}
                  />
                  <Flexbox className={styles.title}>{title}</Flexbox>
                </Flexbox>
                <TitleExtra
                  category={category}
                  engines={engines}
                  highlight={highlight}
                  score={score}
                />
              </Flexbox>
              <Text className={styles.url} type={'secondary'}>
                {url}
              </Text>
              <Flexbox className={styles.desc}>{content}</Flexbox>
            </Flexbox>
          </Flexbox>
        </Flexbox>
        {expand && videoUrl && (
          <Flexbox>
            <iframe className={styles.iframe} height={440} src={videoUrl} width={'100%'} />
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);

export default VideoItem;
