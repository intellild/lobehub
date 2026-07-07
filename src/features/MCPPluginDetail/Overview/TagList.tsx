'use client';

import { Flexbox, Tag } from '@lobehub/ui';
import qs from 'query-string';
import { memo } from 'react';

import { Link } from '@/libs/router';

import styles from './TagList.module.css';

const TagList = memo<{ tags: string[] }>(({ tags }) => {
  const showTags = Boolean(tags?.length && tags?.length > 0);
  return (
    showTags && (
      <Flexbox horizontal gap={8} wrap={'wrap'}>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={qs.stringifyUrl({
              query: {
                q: tag,
              },
              url: '/community/mcp',
            })}
          >
            <Tag className={styles.tag}>{tag}</Tag>
          </Link>
        ))}
      </Flexbox>
    )
  );
});

export default TagList;
