'use client';

import type { DeviceListItem } from '@lobechat/types';
import {
  ActionIcon,
  Avatar,
  Checkbox,
  DropdownMenu,
  Flexbox,
  Icon,
  Tag,
  Text,
  Tooltip,
} from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';
import { FolderIcon, MoreVerticalIcon, Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { lambdaQuery } from '@/libs/trpc/client';

import { refreshDeviceList } from './const';
import styles from './DeviceItem.module.css';
import { getDeviceIcon } from './getDeviceIcon';
import { useCanEditDevice } from './useCanEditDevice';

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

interface DeviceItemProps {
  /** Whether this row is ticked for bulk actions. */
  checked?: boolean;
  device: DeviceListItem;
  isCurrent?: boolean;
  /** Toggle the bulk-selection checkbox. When provided the checkbox is shown. */
  onCheckChange?: (checked: boolean) => void;
  onSelect: () => void;
  selected?: boolean;
  /** True when any editable row in the list is ticked — keeps every checkbox shown. */
  selectionActive?: boolean;
}

const DeviceItem = memo<DeviceItemProps>(
  ({ checked, device, isCurrent, onCheckChange, onSelect, selected, selectionActive }) => {
    const { t } = useTranslation('setting');
    const canEdit = useCanEditDevice()(device);

    // Workspace devices are self-or-owner-gated + workspace-scoped on the
    // server; personal devices stay userId-scoped. Route by the device's own
    // scope.
    const onRemoveSuccess = () => refreshDeviceList();
    const removePersonal = lambdaQuery.device.removeDevice.useMutation({
      onSuccess: onRemoveSuccess,
    });
    const removeWorkspace = lambdaQuery.device.removeWorkspaceDevice.useMutation({
      onSuccess: onRemoveSuccess,
    });
    const removeDevice = device.scope === 'workspace' ? removeWorkspace : removePersonal;

    const displayName = device.friendlyName || device.hostname || device.deviceId;
    const isFallback = device.identitySource === 'fallback';
    // Online when the device has at least one live connection in `device.channels`.
    const channels = device.channels ?? [];
    const online = channels.length > 0;
    const statusTooltip = online
      ? t('devices.channel.connected', {
          time: dayjs(channels[0]?.connectedAt ?? device.lastSeen).fromNow(),
        })
      : t('devices.lastSeen', { time: dayjs(device.lastSeen).fromNow() });

    // Keep the checkbox/glyph swap pinned open when selection is active so it
    // reads as a stable mode rather than a hover-only affordance.
    const pinSelect = !!onCheckChange && (checked || selectionActive);

    const handleRemove = () =>
      confirmModal({
        content: t('devices.remove.confirmDesc'),
        okButtonProps: { danger: true },
        okText: t('devices.actions.remove'),
        onOk: async () => {
          await removeDevice.mutateAsync({ deviceId: device.deviceId });
        },
        title: t('devices.remove.confirm'),
      });

    return (
      <Flexbox
        horizontal
        align={'center'}
        aria-pressed={selected}
        gap={12}
        role={'button'}
        tabIndex={0}
        className={cx(
          styles.row,
          selected && styles.rowActive,
          onCheckChange && styles.selectable,
          pinSelect && styles.selectOn,
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          // Mirror native button keyboard semantics for the div-as-button row.
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <div className={styles.iconTile}>
          <span className={cx(styles.iconGlyph, 'deviceGlyph')}>
            {getDeviceIcon(device.platform)}
          </span>
          {onCheckChange && (
            <span
              className={cx(styles.selectOverlay, 'deviceSelect')}
              onClick={(e) => {
                // Ticking a row is a bulk-select action, not an "open detail" click.
                e.stopPropagation();
                onCheckChange(!checked);
              }}
            >
              <Checkbox checked={checked} />
            </span>
          )}
        </div>

        <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
          <Flexbox horizontal align={'center'} gap={8}>
            <Text ellipsis weight={500}>
              {displayName}
            </Text>
            <Tooltip title={statusTooltip}>
              <span className={online ? styles.statusOnline : styles.statusOffline} />
            </Tooltip>
            {isCurrent && <Tag>{t('devices.currentBadge')}</Tag>}
            {isFallback && (
              <Tooltip title={t('devices.fallbackTooltip')}>
                <Tag icon={<Icon icon={TriangleAlertIcon} />}>{t('devices.fallbackBadge')}</Tag>
              </Tooltip>
            )}
          </Flexbox>
          {device.defaultCwd && (
            <Flexbox horizontal align={'center'} gap={8} style={{ minWidth: 0 }}>
              <Icon icon={FolderIcon} size={12} style={{ color: 'var(--ant-color-text-quaternary)' }} />
              <Text className={styles.cwd} type={'secondary'}>
                {device.defaultCwd}
              </Text>
            </Flexbox>
          )}
        </Flexbox>

        <Flexbox horizontal align={'center'} gap={8} style={{ flex: 'none' }}>
          {device.scope === 'workspace' && device.enroller && (
            // Enroller avatar — the at-a-glance "who put this here" answer for
            // shared workspace pools. Hidden in personal scope (always the
            // caller) and for ghost rows (no row yet).
            <Tooltip
              title={t('workspaceSetting.devices.enrolledBy', {
                name:
                  device.enroller.fullName ||
                  device.enroller.username ||
                  t('workspaceSetting.devices.unknownEnroller'),
              })}
            >
              <span onClick={(e) => e.stopPropagation()}>
                <Avatar avatar={device.enroller.avatar ?? undefined} size={20} />
              </span>
            </Tooltip>
          )}
          {canEdit && (
            <span onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                items={[
                  {
                    danger: true,
                    icon: <Icon icon={Trash2Icon} />,
                    key: 'remove',
                    label: t('devices.actions.remove'),
                    onClick: handleRemove,
                  },
                ]}
              >
                <ActionIcon icon={MoreVerticalIcon} />
              </DropdownMenu>
            </span>
          )}
        </Flexbox>
      </Flexbox>
    );
  },
);

DeviceItem.displayName = 'DeviceItem';

export default DeviceItem;
