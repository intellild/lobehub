'use client';

import { getComposioAppByIdentifier, getLobehubSkillProviderById } from '@lobechat/const';
import { ActionIcon, Flexbox, Icon } from '@lobehub/ui';
import { Blocks, X } from 'lucide-react';
import React, { createElement, memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { createSkillStoreModal } from '@/features/SkillStore';
import { useGlobalStore } from '@/store/global';
import { serverConfigSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useToolStore } from '@/store/tool';

import stylesModule from './SkillInstallBanner.module.css';

// Bump this id when the banner content changes so dismissing the old
// variant does not hide the new one.
export const SKILL_INSTALL_BANNER_ID = 'skill-install-v2';

const ICON_SIZE = 16;
const AVATAR_SIZE = 24;
const styles = stylesModule;

const BANNER_SKILL_IDS = [
  { id: 'gmail', type: 'composio' },
  { id: 'google-drive', type: 'composio' },
  { id: 'google-calendar', type: 'composio' },
  { id: 'slack', type: 'composio' },
  { id: 'notion', type: 'lobehub' },
  { id: 'twitter', type: 'lobehub' },
  { id: 'github', type: 'lobehub' },
] as const;

const SkillInstallBanner = memo(() => {
  const { t } = useTranslation('plugin');

  const isLobehubSkillEnabled = useServerConfigStore(serverConfigSelectors.enableLobehubSkill);
  const isComposioEnabled = useServerConfigStore(serverConfigSelectors.enableComposio);

  const updateSystemStatus = useGlobalStore((s) => s.updateSystemStatus);

  // Prefetch skill connections data so SkillStore opens faster
  const [useFetchLobehubSkillConnections, useFetchUserComposioConnections] = useToolStore((s) => [
    s.useFetchLobehubSkillConnections,
    s.useFetchUserComposioConnections,
  ]);
  useFetchLobehubSkillConnections(isLobehubSkillEnabled);
  useFetchUserComposioConnections(isComposioEnabled);

  const skillIcons = useMemo(() => {
    const icons: Array<{ icon: string | React.ComponentType<{ size?: number }>; key: string }> = [];

    for (const skill of BANNER_SKILL_IDS) {
      if (skill.type === 'lobehub') {
        const provider = getLobehubSkillProviderById(skill.id);
        if (provider) {
          icons.push({ icon: provider.icon, key: provider.id });
        }
      } else {
        const server = getComposioAppByIdentifier(skill.id);
        if (server) {
          icons.push({ icon: server.icon, key: server.identifier });
        }
      }
    }

    return icons;
  }, []);

  const handleOpenStore = useCallback(() => {
    createSkillStoreModal();
  }, []);

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const current = useGlobalStore.getState().status.dismissedBannerIds || [];
      if (current.includes(SKILL_INSTALL_BANNER_ID)) return;
      updateSystemStatus({
        dismissedBannerIds: [...current, SKILL_INSTALL_BANNER_ID],
      });
    },
    [updateSystemStatus],
  );

  return (
    <div className={styles.banner} data-testid="skill-install-banner" onClick={handleOpenStore}>
      <Flexbox horizontal align="center" gap={4}>
        <Icon className={styles.icon} icon={Blocks} size={18} />
        <span className={styles.text}>{t('skillInstallBanner.title')}</span>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        {skillIcons.length > 0 && (
          <div className={styles.iconGroup}>
            {skillIcons.map(({ icon, key }, index) => (
              <div
                className={styles.avatar}
                key={key}
                style={{ marginLeft: index === 0 ? 0 : -6, zIndex: index }}
              >
                {typeof icon === 'string' ? (
                  <img alt={key} height={ICON_SIZE} src={icon} width={ICON_SIZE} />
                ) : (
                  createElement(icon, { size: ICON_SIZE })
                )}
              </div>
            ))}
          </div>
        )}
        <ActionIcon
          icon={X}
          size="small"
          title={t('skillInstallBanner.dismiss')}
          onClick={handleDismiss}
        />
      </Flexbox>
    </div>
  );
});

SkillInstallBanner.displayName = 'SkillInstallBanner';

export default SkillInstallBanner;
