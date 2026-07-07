
import { memo } from 'react';

import stylesModule from './index.module.css';

const styles = stylesModule;

const CircleLoader = memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
      <div className={styles.background} />
    </div>
  );
});

export default CircleLoader;
