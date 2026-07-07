'use client';
import { memo } from 'react';

import styles from './SegmentBar.module.css';

interface SegmentBarProps {
  height?: number;
  /** Proportional segments rendered left→right; zero-value segments are skipped. */
  segments: { color: string; value: number }[];
}

/**
 * A single pill bar split into proportional colored segments — the shared way to
 * show an outcome breakdown (pass / fail / error, status distribution) at a glance
 * across the eval surfaces. Empty (all-zero) renders as a quiet track.
 */
const SegmentBar = memo<SegmentBarProps>(({ segments, height = 8 }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={styles.track} style={{ height }}>
      {total > 0 &&
        segments.map((s, i) =>
          s.value > 0 ? (
            <span
              className={styles.segment}
              key={i}
              style={{ background: s.color, width: `${(s.value / total) * 100}%` }}
            />
          ) : null,
        )}
    </div>
  );
});

export default SegmentBar;
