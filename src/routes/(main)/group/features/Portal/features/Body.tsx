'use client';

import { Flexbox } from '@lobehub/ui';
import { type PropsWithChildren } from 'react';

import styles from './Body.module.css';

const Body = ({ children }: PropsWithChildren) => {
  return (
    <Flexbox
      className={`${styles.body} portal-body`}
      height={'100%'}
      style={{ flex: 1, height: 0, position: 'relative' }}
      width={'100%'}
    >
      {children}
    </Flexbox>
  );
};

export default Body;
