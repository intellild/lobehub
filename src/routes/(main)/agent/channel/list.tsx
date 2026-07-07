'use client';

import { exportJSONFile } from '@lobechat/utils/client';
import { ActionIcon, type DropdownItem, DropdownMenu, Icon, Tag } from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import { App } from 'antd';
import { Book, Download, MoreHorizontal, Trash2, Upload } from 'lucide-react';
import { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import { useAgentStore } from '@/store/agent';
import type { BotProviderItem } from '@/store/agent/slices/bot/action';

import { BOT_RUNTIME_STATUSES, type BotRuntimeStatus } from '../../../../types/botRuntimeStatus';
import { type ChannelPlatformDefinition, getPlatformIcon } from './const';
import styles from './list.module.css';
import MessengerPromo from './MessengerPromo';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

interface PlatformListProps {
  activeId: string;
  agentId: string;
  disabled?: boolean;
  onSelect: (id: string) => void;
  platforms: ChannelPlatformDefinition[];
  providers?: BotProviderItem[];
  runtimeStatuses: Map<string, BotRuntimeStatus>;
}

const PlatformList = memo<PlatformListProps>(
  ({ platforms, activeId, agentId, disabled, onSelect, providers, runtimeStatuses }) => {
    const { t } = useTranslation('agent');
    const theme = useTheme();
    const { message } = App.useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const deleteAllBotProviders = useAgentStore((s) => s.deleteAllBotProviders);
    const createBotProvider = useAgentStore((s) => s.createBotProvider);
    const connectBot = useAgentStore((s) => s.connectBot);

    const handleExport = useCallback(() => {
      if (!providers?.length) return;
      const exportData = providers.map(({ id: _, ...rest }) => rest);
      exportJSONFile(exportData, `lobehub-channels-${agentId}.json`);
    }, [providers, agentId]);

    const handleImport = useCallback(() => {
      if (disabled) return;
      fileInputRef.current?.click();
    }, [disabled]);

    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (disabled) {
          e.target.value = '';
          return;
        }
        if (!file) return;

        try {
          const text = await file.text();
          const data = JSON.parse(text);

          if (!Array.isArray(data)) {
            message.error(t('channel.importInvalidFormat'));
            return;
          }

          for (const item of data) {
            if (!item.platform || !item.applicationId || !item.credentials) {
              message.error(t('channel.importInvalidFormat'));
              return;
            }
          }

          for (const item of data) {
            await createBotProvider({
              agentId,
              applicationId: item.applicationId,
              credentials: item.credentials,
              platform: item.platform,
              settings: item.settings ?? undefined,
            });
            if (item.enabled) {
              await connectBot({
                agentId,
                applicationId: item.applicationId,
                platform: item.platform,
              });
            }
          }

          message.success(t('channel.importSuccess'));
        } catch {
          message.error(t('channel.importFailed'));
        } finally {
          e.target.value = '';
        }
      },
      [agentId, connectBot, createBotProvider, disabled, message, t],
    );

    const handleDeleteAll = useCallback(() => {
      if (disabled) return;
      if (!providers?.length) return;
      confirmModal({
        content: t('channel.deleteAllConfirmDesc'),
        okButtonProps: { danger: true },
        okText: t('channel.deleteAllChannels'),
        onOk: async () => {
          try {
            await deleteAllBotProviders(agentId);
            message.success(t('channel.deleteAllSuccess'));
          } catch {
            message.error(t('channel.deleteAllFailed'));
          }
        },
        title: t('channel.deleteAllConfirm'),
      });
    }, [agentId, deleteAllBotProviders, disabled, message, providers, t]);

    const hasProviders = !!providers?.length;
    const menuItems: DropdownItem[] = [
      {
        icon: <Icon icon={Download} size={'small'} />,
        key: 'export',
        disabled: !hasProviders,
        label: t('channel.exportConfig'),
        onClick: handleExport,
      },
      {
        icon: <Icon icon={Upload} size={'small'} />,
        key: 'import',
        disabled,
        label: t('channel.importConfig'),
        onClick: handleImport,
      },
      { type: 'divider' as const },
      {
        danger: true,
        disabled: disabled || !hasProviders,
        icon: <Icon icon={Trash2} size={'small'} />,
        key: 'deleteAll',
        label: t('channel.deleteAllChannels'),
        onClick: handleDeleteAll,
      },
    ];

    const getStatusColor = (status?: BotRuntimeStatus) => {
      switch (status) {
        case BOT_RUNTIME_STATUSES.connected: {
          return theme.colorSuccess;
        }
        case BOT_RUNTIME_STATUSES.failed: {
          return theme.colorError;
        }
        case BOT_RUNTIME_STATUSES.queued:
        case BOT_RUNTIME_STATUSES.starting: {
          return theme.colorInfo;
        }
        case BOT_RUNTIME_STATUSES.dormant: {
          return theme.colorWarning;
        }
        case BOT_RUNTIME_STATUSES.disconnected: {
          return theme.colorTextQuaternary;
        }
        default: {
          return undefined;
        }
      }
    };

    const getStatusTitle = (status?: BotRuntimeStatus) => {
      switch (status) {
        case BOT_RUNTIME_STATUSES.connected: {
          return t('channel.connectSuccess');
        }
        case BOT_RUNTIME_STATUSES.failed: {
          return t('channel.connectFailed');
        }
        case BOT_RUNTIME_STATUSES.queued: {
          return t('channel.connectQueued');
        }
        case BOT_RUNTIME_STATUSES.starting: {
          return t('channel.connectStarting');
        }
        case BOT_RUNTIME_STATUSES.dormant: {
          return t('channel.statusDormant');
        }
        case BOT_RUNTIME_STATUSES.disconnected: {
          return t('channel.runtimeDisconnected');
        }
        default: {
          return undefined;
        }
      }
    };

    return (
      <aside className={styles.root}>
        <div className={styles.list}>
          <input
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
            onChange={handleFileChange}
          />
          {platforms.map((platform) => {
            const PlatformIcon = getPlatformIcon(platform.name);
            const ColorIcon =
              PlatformIcon && 'Color' in PlatformIcon ? (PlatformIcon as any).Color : PlatformIcon;
            const runtimeStatus = platform.comingSoon
              ? undefined
              : runtimeStatuses.get(platform.id);
            const statusColor = getStatusColor(runtimeStatus);
            const statusTitle = getStatusTitle(runtimeStatus);
            return (
              <button
                className={cx(styles.item, activeId === platform.id && 'active')}
                key={platform.id}
                onClick={() => onSelect(platform.id)}
              >
                {ColorIcon && <ColorIcon size={20} />}
                <span style={{ flex: 1 }}>{platform.name}</span>
                {platform.comingSoon && (
                  <Tag size={'small'} style={{ marginInlineEnd: 0 }}>
                    {t('channel.comingSoon')}
                  </Tag>
                )}
                {platform.access?.requiredPlan === 'paid' && (
                  <Tag color="gold" size={'small'} style={{ marginInlineEnd: 0 }}>
                    {platform.access.rolloutMode === 'notice'
                      ? t('channel.paidFeature.noticeBadge')
                      : t('channel.paidFeature.badge')}
                  </Tag>
                )}
                {runtimeStatus && (
                  <div
                    className={styles.statusDot}
                    style={{ background: statusColor }}
                    title={statusTitle}
                  />
                )}
              </button>
            );
          })}
        </div>
        <MessengerPromo />
        <div
          style={{
            alignItems: 'center',
            borderTop: `1px solid ${theme.colorBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            padding: 12,
          }}
        >
          <a
            href="https://lobehub.com/docs/usage/channels/overview"
            rel="noopener noreferrer"
            target="_blank"
            style={{
              alignItems: 'center',
              color: theme.colorTextSecondary,
              display: 'flex',
              fontSize: 12,
              gap: 4,
            }}
          >
            <Icon icon={Book} size={'small'} /> {t('channel.documentation')}
          </a>
          <DropdownMenu items={menuItems}>
            <ActionIcon icon={MoreHorizontal} />
          </DropdownMenu>
        </div>
      </aside>
    );
  },
);

export default PlatformList;
