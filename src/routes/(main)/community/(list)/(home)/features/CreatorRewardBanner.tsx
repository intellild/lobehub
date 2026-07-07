'use client';

import { Button, Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsDark } from '@/hooks/useIsDark';

import styles from './CreatorRewardBanner.module.css';

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

const CreatorRewardBanner = memo(() => {
  const { t } = useTranslation('discover');
  const isDark = useIsDark();

  return (
    <Flexbox
      className={cx(styles.banner, isDark ? styles.banner_dark : styles.banner_light)}
      width={'100%'}
    >
      <Flexbox gap={8} style={{ position: 'relative', zIndex: 1 }}>
        <h2 className={cx(styles.title, isDark ? styles.title_dark : styles.title_light)}>
          {t('home.creatorReward.title')}
        </h2>
        <p className={cx(styles.subtitle, isDark ? styles.subtitle_dark : styles.subtitle_light)}>
          {t('home.creatorReward.subtitle')}
        </p>
        <div style={{ marginBlockStart: 4 }}>
          <a href={'https://lobehub.com/creator?utm_source=lobehub'} rel={'noopener noreferrer'} target={'_blank'}>
            <Button type={'primary'}>{t('home.creatorReward.action')}</Button>
          </a>
        </div>
      </Flexbox>
      <div className={styles.symbols} />
    </Flexbox>
  );
});

export default CreatorRewardBanner;
