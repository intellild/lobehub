'use client';

import { useWatchBroadcast } from '@lobechat/electron-client-ipc';
import { AnimatePresence, m } from 'motion/react';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';

const HUD_DURATION_MS = 1500;

const ZoomHUD = memo(() => {
  const { t } = useTranslation('common');
  const [factor, setFactor] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useWatchBroadcast('zoom:changed', ({ factor: next }) => {
    setFactor(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFactor(null), HUD_DURATION_MS);
  });

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <AnimatePresence>
      {factor !== null && (
        <div className={styles.layer}>
          <m.div
            animate={{ opacity: 1, scale: 1 }}
            aria-live="polite"
            className={styles.hud}
            exit={{ opacity: 0, scale: 0.96 }}
            initial={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.num}>{Math.round(factor * 100)}%</span>
            <span className={styles.caption}>{t('zoom')}</span>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ZoomHUD.displayName = 'ZoomHUD';

export default ZoomHUD;
