'use client';

import { type TopicPopupInfo } from '@lobechat/electron-client-ipc';
import { Button, Flexbox } from '@lobehub/ui';
import { ExternalLinkIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ensureElectronIpc } from '@/utils/electron/ipc';

import styles from './index.module.css';

interface TopicInPopupGuardProps {
  popup: TopicPopupInfo;
}

const TopicInPopupGuard = memo<TopicInPopupGuardProps>(({ popup }) => {
  const { t } = useTranslation('topic');

  const handleFocus = async () => {
    try {
      await ensureElectronIpc().windows.focusTopicPopup({ identifier: popup.identifier });
    } catch (error) {
      console.error('[TopicInPopupGuard] Failed to focus popup window:', error);
    }
  };

  return (
    <Flexbox
      align={'center'}
      className={styles.wrapper}
      flex={1}
      gap={16}
      justify={'center'}
      width={'100%'}
    >
      <h2 className={styles.title}>{t('inPopup.title')}</h2>
      <p className={styles.description}>{t('inPopup.description')}</p>
      <Button icon={ExternalLinkIcon} type={'primary'} onClick={handleFocus}>
        {t('inPopup.focus')}
      </Button>
    </Flexbox>
  );
});

TopicInPopupGuard.displayName = 'TopicInPopupGuard';

export default TopicInPopupGuard;
