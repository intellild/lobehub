'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import { shinyTextStyles } from '@/styles';

import stylesModule from './InitializingState.module.css';

const styles = stylesModule;

const InitializingState = memo(() => {
  const { t } = useTranslation('chat');

  return (
    <Flexbox className={styles.container} gap={12}>
      <Flexbox horizontal align="center" gap={8}>
        <NeuralNetworkLoading size={14} />
        <Text className={shinyTextStyles.shinyText} weight={500}>
          {t('task.status.initializing')}
        </Text>
      </Flexbox>
    </Flexbox>
  );
});

InitializingState.displayName = 'InitializingState';

export default InitializingState;
