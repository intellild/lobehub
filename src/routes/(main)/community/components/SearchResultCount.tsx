'use client';
import { memo } from 'react';
import { Trans } from 'react-i18next';

import styles from './SearchResultCount.module.css';
import Title from './Title';

const SearchResultCount = memo<{ count: number; keyword: string }>(({ keyword, count }) => {
  return (
    <Title>
      <Trans
        components={{ highlight: <span className={styles.highlight} /> }}
        i18nKey={'search.result'}
        ns={'discover'}
        values={{
          count,
          keyword,
        }}
      />
    </Title>
  );
});

export default SearchResultCount;
