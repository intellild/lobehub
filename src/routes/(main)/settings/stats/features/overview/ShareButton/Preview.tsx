import { OFFICIAL_URL } from '@lobechat/const';
import { Center, Flexbox, Grid } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductLogo } from '@/components/Branding';
import UserAvatar from '@/features/User/UserAvatar';

import AiHeatmaps from '../../visualization/AiHeatmaps';
import TotalMessages from '../TotalMessages';
import TotalTokens from '../TotalTokens';
import styles from './Preview.module.css';

const Preview = memo(() => {
  const { t } = useTranslation('auth');

  return (
    <div className={styles.preview}>
      <div className={styles.background} id={'preview'}>
        <Center className={styles.container} gap={12} padding={24}>
          <ProductLogo size={24} type={'text'} />
          <div className={styles.title}>{t('stats.share.title')}</div>
          <Flexbox horizontal align={'center'}>
            <UserAvatar
              className={styles.avatar}
              shape={'circle'}
              size={48}
              style={{
                marginRight: -12,
                zIndex: 2,
              }}
            />
            <Center
              className={styles.avatar}
              height={48}
              width={48}
              style={{
                borderRadius: '50%',
                zIndex: 1,
              }}
            >
              <ProductLogo size={40} />
            </Center>
          </Flexbox>
          <Flexbox gap={12} paddingBlock={12} width={'100%'}>
            <AiHeatmaps
              inShare
              blockMargin={2}
              blockRadius={1}
              blockSize={4.5}
              className={styles.heatmaps}
              width={'100%'}
              style={{
                marginTop: -12,
              }}
            />
            <Grid gap={8} maxItemWidth={100} rows={2} width={'100%'}>
              <TotalMessages inShare />
              <TotalTokens inShare />
            </Grid>
          </Flexbox>
          <div className={styles.footer}>{OFFICIAL_URL}</div>
        </Center>
      </div>
    </div>
  );
});

export default Preview;
