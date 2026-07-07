import { type UpdateInfo } from '@lobechat/electron-client-ipc';
import { useWatchBroadcast } from '@lobechat/electron-client-ipc';
import { Flexbox, Icon, Markdown } from '@lobehub/ui';
import { Button as BaseButton, createModal, useModalContext } from '@lobehub/ui/base-ui';
import { t } from 'i18next';
import { CircleFadingArrowUp, X } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { autoUpdateService } from '@/services/electron/autoUpdate';

import styles from './UpdateNotification.module.css';

interface UpdateDetailContentProps {
  updateInfo: UpdateInfo;
}

const UpdateDetailContent = memo<UpdateDetailContentProps>(({ updateInfo }) => {
  const { t: tElectron } = useTranslation('electron');
  const { close } = useModalContext();
  const [isInstalling, setIsInstalling] = useState(false);

  return (
    <Flexbox gap={12} style={{ maxWidth: 480 }}>
      <div style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>{updateInfo.version}</div>
      {updateInfo.releaseNotes &&
        (typeof updateInfo.releaseNotes === 'string' ? (
          <div className={styles.releaseNote}>
            <Markdown>{updateInfo.releaseNotes}</Markdown>
          </div>
        ) : (
          <div className={styles.releaseNote}>
            {updateInfo.releaseNotes.map((note) => (
              <Markdown key={note.version}>{note.note ?? ''}</Markdown>
            ))}
          </div>
        ))}
      <Flexbox horizontal gap={8} justify={'flex-end'}>
        <BaseButton
          onClick={() => {
            autoUpdateService.installLater();
            close();
          }}
        >
          {tElectron('updater.installLater')}
        </BaseButton>
        <BaseButton
          loading={isInstalling}
          type={'primary'}
          onClick={() => {
            setIsInstalling(true);
            autoUpdateService.installNow();
          }}
        >
          {tElectron('updater.restartAndInstall')}
        </BaseButton>
      </Flexbox>
    </Flexbox>
  );
});

UpdateDetailContent.displayName = 'UpdateDetailContent';

const openUpdateDetailModal = (updateInfo: UpdateInfo) =>
  createModal({
    content: <UpdateDetailContent updateInfo={updateInfo} />,
    footer: null,
    maskClosable: true,
    title: t('updater.updateReady', { ns: 'electron' }),
    width: 520,
  });

export const UpdateNotification: React.FC = () => {
  const { t: tElectron } = useTranslation('electron');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [installConfirmMode, setInstallConfirmMode] = useState<
    'unconfirm' | 'installLater' | 'installNow' | null
  >('unconfirm');
  const [isInstalling, setIsInstalling] = useState(false);

  useWatchBroadcast('updateDownloaded', (info: UpdateInfo) => {
    setUpdateInfo(info);
    setUpdateDownloaded(true);
    setUpdateAvailable(false);
    setInstallConfirmMode('unconfirm');
  });

  useWatchBroadcast('updateWillInstallLater', () => {
    setInstallConfirmMode('installLater');

    setTimeout(() => setInstallConfirmMode(null), 5000);
  });

  if (!updateDownloaded && !updateAvailable) return null;

  if (installConfirmMode === 'installLater') {
    return (
      <div className={styles.installLaterToast}>
        {tElectron('updater.willInstallLater')}
        <button
          aria-label="Close"
          className={styles.installLaterCloseButton}
          type="button"
          onClick={() => setInstallConfirmMode(null)}
        >
          <Icon icon={X} style={{ fontSize: 14 }} />
        </button>
      </div>
    );
  }

  if (installConfirmMode === 'unconfirm')
    return (
      <div className={styles.container}>
        <div
          style={{
            alignItems: 'center',
            background: 'var(--ant-color-bg-elevated)',
            border: `1px solid ${'var(--ant-color-border-secondary)'}`,
            borderRadius: 12,
            boxShadow: 'var(--ant-box-shadow)',
            color: 'var(--ant-color-text)',
            display: 'flex',
            gap: 8,
            padding: '8px 10px',
          }}
        >
          <Icon icon={CircleFadingArrowUp} style={{ fontSize: 16 }} />
          <div
            style={{ cursor: 'pointer', fontSize: 12 }}
            onClick={() => {
              if (updateInfo) openUpdateDetailModal(updateInfo);
            }}
          >
            {tElectron('updater.updateReady')}
            {updateInfo?.version ? ` · ${updateInfo.version}` : ''}
          </div>
          <div style={{ flex: 1 }} />
          <BaseButton
            size="small"
            type="text"
            onClick={() => {
              autoUpdateService.installLater();
            }}
          >
            {tElectron('updater.later')}
          </BaseButton>

          <BaseButton
            loading={isInstalling}
            size="small"
            type="primary"
            onClick={() => {
              setIsInstalling(true);
              autoUpdateService.installNow();
            }}
          >
            {tElectron('updater.upgradeNow')}
          </BaseButton>
        </div>
      </div>
    );

  return null;
};
