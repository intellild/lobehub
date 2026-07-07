'use client';

import { Center } from '@lobehub/ui';
import React, { memo } from 'react';

import styles from './Loading.module.css';

const DataLoading = memo(() => {
  return (
    <Center style={{ height: 80 }}>
      <div className={styles.loader} />
    </Center>
  );
});

export default DataLoading;
