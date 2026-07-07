
import { type CSSProperties, memo } from 'react';

import styles from './index.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

interface StyleArgs {
  color?: string;
  gap?: number;
  size?: number;
}

interface DotsLoadingProps extends StyleArgs {
  className?: string;
  style?: CSSProperties;
}

const DotsLoading = memo<DotsLoadingProps>(({ size = 4, gap = 3, color, className, style }) => {
  const cssVars = {
    '--dots-loading-color': color || 'var(--ant-color-text-secondary)',
    '--dots-loading-gap': `${gap}px`,
    '--dots-loading-size': `${size}px`,
  } as CSSProperties;

  return (
    <div className={cx(styles.container, className)} style={{ ...cssVars, ...style }}>
      <div className={styles.dot} style={{ animationDelay: '0s' }} />
      <div className={styles.dot} style={{ animationDelay: '0.15s' }} />
      <div className={styles.dot} style={{ animationDelay: '0.3s' }} />
    </div>
  );
});

export default DotsLoading;
