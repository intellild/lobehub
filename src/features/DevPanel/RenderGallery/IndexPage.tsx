'use client';

import { Flexbox } from '@lobehub/ui';
import { Navigate } from 'react-router';

import styles from './IndexPage.module.css';
import { toToolsetPath, useDevtoolsEntries } from './useDevtoolsEntries';

const DevtoolsIndex = () => {
  const { defaultToolset } = useDevtoolsEntries();

  if (defaultToolset) {
    return <Navigate replace to={toToolsetPath(defaultToolset.identifier)} />;
  }

  return <Flexbox className={styles.empty}>No builtin tool renders registered.</Flexbox>;
};

export default DevtoolsIndex;
