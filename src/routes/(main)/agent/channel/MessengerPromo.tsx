'use client';

import { ActionIcon } from '@lobehub/ui';
import { Discord, Slack, Telegram } from '@lobehub/ui/icons';
import { X } from 'lucide-react';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import styles from './MessengerPromo.module.css';

// Bump this id when the card content changes so dismissing the old
// variant does not hide the new one.
const MESSENGER_PROMO_ID = 'messenger-promo-v1';

const ICON_SIZE = 16;

const MessengerPromo = memo(() => {
  const { t } = useTranslation('agent');
  const navigate = useWorkspaceAwareNavigate();

  const isDismissed = useGlobalStore(systemStatusSelectors.isBannerDismissed(MESSENGER_PROMO_ID));
  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  const handleClick = useCallback(() => {
    navigate('/settings/messenger');
  }, [navigate]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const current = useGlobalStore.getState().status.dismissedBannerIds || [];
      if (current.includes(MESSENGER_PROMO_ID)) return;
      updateSystemStatus({
        dismissedBannerIds: [...current, MESSENGER_PROMO_ID],
      });
    },
    [updateSystemStatus],
  );

  if (isDismissed) return null;

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.closeButton}>
        <ActionIcon
          icon={X}
          size="small"
          title={t('channel.messengerPromo.dismiss')}
          onClick={handleDismiss}
        />
      </div>
      <div className={styles.iconRow}>
        <Slack.Color size={ICON_SIZE} />
        <Discord.Color size={ICON_SIZE} />
        <Telegram.Color size={ICON_SIZE} />
      </div>
      <div className={styles.title}>{t('channel.messengerPromo.title')}</div>
      <div className={styles.desc}>{t('channel.messengerPromo.desc')}</div>
    </div>
  );
});

MessengerPromo.displayName = 'MessengerPromo';

export default MessengerPromo;
