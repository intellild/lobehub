'use client';

import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';

import styles from './RefreshingHint.module.css';

const RefreshingHint = memo(() => {
  const { t } = useTranslation('chat');

  return (
    <Flexbox
      horizontal
      align={'center'}
      aria-live={'polite'}
      className={styles.container}
      gap={6}
      justify={'center'}
      role={'status'}
    >
      <span className={styles.loader}>
        <NeuralNetworkLoading size={12} />
      </span>
      <span>{t('chatList.refreshing')}</span>
    </Flexbox>
  );
});

RefreshingHint.displayName = 'ConversationRefreshingHint';

export default RefreshingHint;
