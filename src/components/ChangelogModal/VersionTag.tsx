'use client';

import { Tag } from '@lobehub/ui';
import { memo } from 'react';

import styles from './VersionTag.module.css';

const VersionTag = memo<{ range: string[] }>(({ range }) => {
  return <Tag className={styles.tag}>{range.map((v) => 'v' + v).join(' ~ ')}</Tag>;
});

export default VersionTag;
