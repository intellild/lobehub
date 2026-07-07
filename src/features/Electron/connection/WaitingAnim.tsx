'use client';

import { Icon } from '@lobehub/ui';
import { WifiIcon } from 'lucide-react';
import { memo } from 'react';

import stylesModule from './WaitingAnim.module.css';

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

const styles = stylesModule;

const WaitingAnim = memo(() => {
  return (
    <div className={styles.container}>
      {/* Added: star rings */}
      <div className={cx(styles.ringBase, styles.ring1)} />
      <div className={cx(styles.ringBase, styles.ring2)} />
      <div className={cx(styles.ringBase, styles.ring3)} />
      {/* Pulses */}
      <div className={cx(styles.pulseBase, styles.pulse1)} />
      <div className={cx(styles.pulseBase, styles.pulse2)} />
      <div className={cx(styles.pulseBase, styles.pulse3)} />

      <Icon className={styles.radarIcon} icon={WifiIcon} size={40} />
    </div>
  );
});

export default WaitingAnim;
