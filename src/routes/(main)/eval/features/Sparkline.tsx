'use client';
import { memo } from 'react';

import styles from './Sparkline.module.css';

interface SparklineProps {
  /** Highest-index value is the most recent run. */
  values: number[];
  width?: number;
}

/**
 * Pass-rate trend across a benchmark's recent runs — a compact at-a-glance read
 * of whether quality is climbing. Values are 0..1; the latest run is drawn in the
 * primary color, earlier runs in a muted success fill.
 */
const Sparkline = memo<SparklineProps>(({ values, width = 132 }) => {
  const height = 40;
  const gap = 4;
  const n = values.length;
  const barWidth = Math.max(3, (width - (n - 1) * gap) / n);

  return (
    <svg height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
      {values.map((v, i) => {
        const clamped = Math.max(0, Math.min(1, v));
        const barHeight = Math.max(3, clamped * height);
        const isLatest = i === n - 1;
        return (
          <rect
            className={styles.bar}
            fill={isLatest ? 'var(--ant-color-primary)' : 'var(--ant-color-success)'}
            height={barHeight}
            key={i}
            opacity={isLatest ? 1 : 0.45}
            rx={2}
            width={barWidth}
            x={i * (barWidth + gap)}
            y={height - barHeight}
          />
        );
      })}
    </svg>
  );
});

export default Sparkline;
