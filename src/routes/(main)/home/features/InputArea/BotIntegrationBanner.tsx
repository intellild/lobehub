'use client';

import { ActionIcon, Flexbox, Icon } from '@lobehub/ui';
import { RadioTowerIcon, X } from 'lucide-react';
import type { FC } from 'react';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { getPlatformIcon } from '@/routes/(main)/agent/channel/const';
import { useAgentStore } from '@/store/agent';
import { builtinAgentSelectors } from '@/store/agent/selectors/builtinAgentSelectors';
import { useGlobalStore } from '@/store/global';

import stylesModule from './BotIntegrationBanner.module.css';

// Bump this id when the banner content changes so dismissing the old
// variant does not hide the new one.
export const BOT_INTEGRATION_BANNER_ID = 'bot-integration-v2';

const ICON_SIZE = 16;
const AVATAR_SIZE = 24;

const BANNER_PLATFORM_NAMES = [
  'Discord',
  'Slack',
  'Telegram',
  'Line',
  'Lark',
  'WeChat',
  'QQ',
] as const;
const styles = stylesModule;

const BotIntegrationBanner = memo(() => {
  const { t } = useTranslation('common');
  const navigate = useWorkspaceAwareNavigate();

  const inboxAgentId = useAgentStore(builtinAgentSelectors.inboxAgentId);
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

  const handleNavigateToChannels = useCallback(() => {
    if (!inboxAgentId) return;
    navigate(`/agent/${inboxAgentId}/channel`);
  }, [inboxAgentId, navigate]);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const current = useGlobalStore.getState().status.dismissedBannerIds || [];
      if (current.includes(BOT_INTEGRATION_BANNER_ID)) return;
      updateSystemStatus({
        dismissedBannerIds: [...current, BOT_INTEGRATION_BANNER_ID],
      });
    },
    [updateSystemStatus],
  );

  return (
    <div
      className={styles.banner}
      data-testid="bot-integration-banner"
      onClick={handleNavigateToChannels}
    >
      <Flexbox horizontal align="center" gap={8}>
        <Icon className={styles.icon} icon={RadioTowerIcon} size={18} />
        <span className={styles.text}>{t('botIntegrationBanner.title')}</span>
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
          title={t('botIntegrationBanner.dismiss')}
          onClick={handleDismiss}
        />
      </Flexbox>
    </div>
  );
});

BotIntegrationBanner.displayName = 'BotIntegrationBanner';

export default BotIntegrationBanner;
