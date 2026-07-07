'use client';
import { memo } from 'react';

import { useIsDark } from '@/hooks/useIsDark';

import styles from './Divider.module.css';

const Divider = memo(() => {
  const isDarkMode = useIsDark();

  return <div className={isDarkMode ? styles.dividerDark : styles.dividerLight} />;
});

export default Divider;
