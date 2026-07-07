'use client';

import { Center } from '@lobehub/ui';
import { memo } from 'react';

import styles from './Banner.module.css';

interface BannerProps {
  avatar?: string | null;
  bannerUrl?: string | null;
}

const Banner = memo<BannerProps>(({ avatar, bannerUrl }) => {
  const backgroundImage = bannerUrl || avatar;
  const shouldBlur = !bannerUrl && !!avatar;

  return (
    <>
      <div className={styles.banner}>
        <Center className={styles.bannerInner}>
          {backgroundImage && (
            <div
              className={shouldBlur ? styles.bannerAvatar : undefined}
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                height: '100%',
                width: '100%',
              }}
            />
          )}
        </Center>
      </div>
      <div className={styles.placeholder} />
    </>
  );
});

export default Banner;
