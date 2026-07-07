'use client';

import { Icon } from '@lobehub/ui';
import { Activity, CheckCircle2, Clock, Hourglass, Pause, XCircle } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './StatusBadge.module.css';

const statusConfig: Record<string, { cls: string; icon: any }> = {
  aborted: { cls: 'default', icon: Pause },
  completed: { cls: 'success', icon: CheckCircle2 },
  external: { cls: 'warning', icon: Hourglass },
  failed: { cls: 'error', icon: XCircle },
  idle: { cls: 'default', icon: Clock },
  pending: { cls: 'warning', icon: Clock },
  running: { cls: 'primary', icon: Activity },
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = memo<StatusBadgeProps>(({ status }) => {
  const { t } = useTranslation('eval');
  const config = statusConfig[status] || statusConfig.idle;

  return (
    <span className={`${styles.wrapper} ${(styles as any)[config.cls] || styles.default}`}>
      <Icon icon={config.icon} size={12} />
      {t(`run.status.${status}` as any)}
    </span>
  );
});

export default StatusBadge;
