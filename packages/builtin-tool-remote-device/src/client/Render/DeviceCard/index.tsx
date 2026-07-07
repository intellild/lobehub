'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { CheckCircle2, MonitorIcon } from 'lucide-react';
import { memo } from 'react';

import type { DeviceAttachment } from '../../../ExecutionRuntime/types';
import styles from './index.module.css';

interface DeviceCardProps {
  /** Render the activated treatment (check badge) instead of the online badge. */
  activated?: boolean;
  device: DeviceAttachment;
}

const DeviceCard = memo<DeviceCardProps>(({ device, activated }) => (
  <Flexbox horizontal align={'center'} className={styles.card} gap={12}>
    <Flexbox align={'center'} className={styles.icon} justify={'center'}>
      <Icon icon={MonitorIcon} size={18} />
    </Flexbox>
    <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
      <span className={styles.hostname}>{device.hostname}</span>
      <span className={styles.meta}>
        {device.platform} · {device.deviceId.slice(0, 12)}
      </span>
    </Flexbox>
    {activated ? (
      <span className={[styles.badge, styles.activated].join(' ')}>
        <Icon icon={CheckCircle2} size={12} />
        Activated
      </span>
    ) : (
      device.online && <span className={[styles.badge, styles.online].join(' ')}>Online</span>
    )}
  </Flexbox>
));

DeviceCard.displayName = 'DeviceCard';

export default DeviceCard;
