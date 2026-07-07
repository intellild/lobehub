'use client';

import { useWatchBroadcast } from '@lobechat/electron-client-ipc';
import { Button, Flexbox, Highlighter, Icon, Text } from '@lobehub/ui';
import { ShieldX } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useElectronStore } from '@/store/electron';

import styles from './Waiting.module.css';
import WaitingAnim from './WaitingAnim';

interface WaitingOAuthProps {
  setIsOpen: (open: boolean) => void;
  setWaiting: (waiting: boolean) => void;
}

const WaitingOAuth = memo<WaitingOAuthProps>(({ setWaiting, setIsOpen }) => {
  const { t } = useTranslation('electron');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const remoteServerSyncError = useElectronStore((s) => s.remoteServerSyncError);
  const [disconnect, refreshServerConfig, connectRemoteServer, clearRemoteServerSyncError] =
    useElectronStore((s) => [
      s.disconnectRemoteServer,
      s.refreshServerConfig,
      s.connectRemoteServer,
      s.clearRemoteServerSyncError,
    ]);

  const handleCancel = async () => {
    await disconnect();
    setWaiting(false);
    setErrorMessage(null);
    clearRemoteServerSyncError();
  };

  const handleRetry = async () => {
    setErrorMessage(null);
    clearRemoteServerSyncError();
    const { dataSyncConfig } = useElectronStore.getState();
    await connectRemoteServer(dataSyncConfig);
  };

  useEffect(() => {
    if (!remoteServerSyncError?.message) return;
    setErrorMessage(remoteServerSyncError.message);
  }, [remoteServerSyncError?.message]);

  useWatchBroadcast('authorizationSuccessful', async () => {
    setIsOpen(false);
    setWaiting(false);
    setErrorMessage(null);
    clearRemoteServerSyncError();
    await refreshServerConfig();
  });

  useWatchBroadcast('authorizationFailed', ({ error }) => {
    setErrorMessage(error);
  });

  // Error state
  if (errorMessage) {
    return (
      <div className={styles.container}>
        <Flexbox className={styles.content} gap={12}>
          <Flexbox align={'center'}>
            <Icon className={styles.errorIcon} icon={ShieldX} size={64} />
            <Text as={'h4'} className={styles.title}>
              {t('waitingOAuth.errorTitle')}
            </Text>
          </Flexbox>
          <Highlighter language={'log'} style={{ maxHeight: 500, maxWidth: 800, overflow: 'auto' }}>
            {errorMessage}
          </Highlighter>
          <Flexbox horizontal gap={12}>
            <Button onClick={handleCancel}>{t('waitingOAuth.cancel')}</Button>
            <Button type="primary" onClick={handleRetry}>
              {t('waitingOAuth.retry')}
            </Button>
          </Flexbox>
        </Flexbox>
      </div>
    );
  }

  // Normal waiting state
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <WaitingAnim />
        <Text as={'h4'} className={styles.title}>
          {t('waitingOAuth.title')}
        </Text>
        <Text className={styles.description}>{t('waitingOAuth.description')}</Text>
        <Button onClick={handleCancel}>{t('waitingOAuth.cancel')}</Button>
        <Text className={styles.helpText}>{t('waitingOAuth.helpText')}</Text>
      </div>
    </div>
  );
});

export default WaitingOAuth;
