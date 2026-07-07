'use client';

import { Icon } from '@lobehub/ui';
import { Brain, ChartBar, Loader2, MessageSquare } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

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

const RunningState = memo(() => {
  const { t } = useTranslation('eval');

  return (
    <div className={styles.container}>
      <div className={styles.orbitGroup}>
        <div className={cx(styles.orbit, styles.orbit1)} />
        <div className={cx(styles.orbit, styles.orbit2)} />
        <div className={cx(styles.orbit, styles.orbit3)} />
        <div className={cx(styles.icon, styles.icon1)}>
          <Icon icon={Brain} size={16} />
        </div>
        <div className={cx(styles.icon, styles.icon2)}>
          <Icon icon={MessageSquare} size={16} />
        </div>
        <div className={cx(styles.icon, styles.icon3)}>
          <Icon icon={ChartBar} size={16} />
        </div>
        <div className={styles.center}>
          <Icon className={styles.spinner} icon={Loader2} size={18} />
        </div>
      </div>
      <div className={styles.hint}>{t('run.running.hint')}</div>
    </div>
  );
});

export default RunningState;
