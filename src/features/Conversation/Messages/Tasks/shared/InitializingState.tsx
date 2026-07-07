'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NeuralNetworkLoading from '@/components/NeuralNetworkLoading';
import { shinyTextStyles } from '@/styles';

import stylesModule from './InitializingState.module.css';
import { formatElapsedTime } from './utils';

const styles = stylesModule;

const InitializingState = memo(() => {
  const { t } = useTranslation('chat');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for updating elapsed time every second
  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Flexbox className={styles.container} gap={12}>
      <Flexbox horizontal align="center" gap={8}>
        <NeuralNetworkLoading size={14} />
        <Text className={shinyTextStyles.shinyText} weight={500}>
          {t('task.status.initializing')}
        </Text>
        <Text type="secondary">({formatElapsedTime(elapsedTime)})</Text>
      </Flexbox>
    </Flexbox>
  );
});

InitializingState.displayName = 'InitializingState';

export default InitializingState;
