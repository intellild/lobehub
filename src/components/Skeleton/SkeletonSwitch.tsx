import { Skeleton } from '@lobehub/ui';

import styles from './SkeletonSwitch.module.css';

export const SkeletonSwitch = () => {
  return <Skeleton.Button active className={styles.switchLoading} />;
};
