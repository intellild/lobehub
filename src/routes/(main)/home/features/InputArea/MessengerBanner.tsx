'use client';

import { ActionIcon, Flexbox, Icon } from '@lobehub/ui';
import { MessageCircleIcon, X } from 'lucide-react';
import type { FC } from 'react';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { getPlatformIcon } from '@/routes/(main)/agent/channel/const';
import { useGlobalStore } from '@/store/global';

import stylesModule from './MessengerBanner.module.css';

// Bump this id when the banner content changes so dismissing the old
// variant does not hide the new one.
export const MESSENGER_BANNER_ID = 'messenger-v1';

const ICON_SIZE = 16;
const AVATAR_SIZE = 24;

// Platforms supported by the Messenger feature (see src/features/Messenger/constants.tsx).
const BANNER_PLATFORM_NAMES = ['Discord', 'Slack', 'Telegram'] as const;
const styles = stylesModule;

const MessengerBanner = memo(() => {
  const { t } = useTranslation('common');
  const navigate = useWorkspaceAwareNavigate();

  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  const platformIcons = useMemo(() => {
    const icons: Array<{ Icon: FC<any>; key: string }> = [];

    for (const name of BANNER_PLATFORM_NAMES) {
      const PlatformIcon = getPlatformIcon(name);
      if (!PlatformIcon) continue;
      const ColorIcon =
        'Color' in PlatformIcon
          ? ((PlatformIcon as any).Color as FC<any>)
          : (PlatformIcon as FC<any>);
      icons.push({ Icon: ColorIcon, key: name });
    }

    return icons;
  }, []);

  const handleNavigateToMessenger = useCallback(() => {
    navigate('/settings/messenger');
  }, [navigate]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const current = useGlobalStore.getState().status.dismissedBannerIds || [];
      if (current.includes(MESSENGER_BANNER_ID)) return;
      updateSystemStatus({
        dismissedBannerIds: [...current, MESSENGER_BANNER_ID],
      });
    },
    [updateSystemStatus],
  );

  return (
    <div
      className={styles.banner}
      data-testid="messenger-banner"
      onClick={handleNavigateToMessenger}
    >
      <Flexbox horizontal align="center" gap={8}>
        <Icon className={styles.icon} icon={MessageCircleIcon} size={18} />
        <span className={styles.text}>{t('messengerBanner.title')}</span>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        {platformIcons.length > 0 && (
          <div className={styles.iconGroup}>
            {platformIcons.map(({ Icon: PlatformIcon, key }, index) => (
              <div
                className={styles.avatar}
                key={key}
                style={{ marginLeft: index === 0 ? 0 : -6, zIndex: index }}
              >
                <PlatformIcon size={ICON_SIZE} />
              </div>
            ))}
          </div>
        )}
        <ActionIcon
          icon={X}
          size="small"
          title={t('messengerBanner.dismiss')}
          onClick={handleDismiss}
        />
      </Flexbox>
    </div>
  );
});

MessengerBanner.displayName = 'MessengerBanner';

export default MessengerBanner;
