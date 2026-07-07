'use client';

import { Flexbox } from '@lobehub/ui';
import { type CSSProperties } from 'react';
import { memo } from 'react';

import styles from './index.module.css';

interface PanelTitleProps {
  desc?: string;
  style?: CSSProperties;
  title?: string;
}

const PanelTitle = memo(({ title, desc, style }: PanelTitleProps) => {
  return (
    <Flexbox className={styles.header} gap={4} style={style}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.desc}>{desc}</p>
    </Flexbox>
  );
});

export default PanelTitle;
