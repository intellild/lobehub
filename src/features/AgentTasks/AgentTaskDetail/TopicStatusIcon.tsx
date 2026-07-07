import { Icon } from '@lobehub/ui';
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleSlash,
  CircleX,
  type LucideIcon,
} from 'lucide-react';
import { memo } from 'react';

type TopicRunStatus = 'canceled' | 'completed' | 'failed' | 'pending' | 'running' | 'timeout';

const STATIC_META: Record<
  Exclude<TopicRunStatus, 'running'>,
  { color: string; icon: LucideIcon }
> = {
  canceled: { color: 'var(--ant-color-text-secondary)', icon: CircleSlash },
  completed: { color: 'var(--ant-color-success)', icon: CircleCheck },
  failed: { color: 'var(--ant-color-error)', icon: CircleX },
  pending: { color: 'var(--ant-color-text-quaternary)', icon: CircleDashed },
  timeout: { color: 'var(--ant-color-warning)', icon: CircleAlert },
};

const RunningIcon = memo<{ size: number }>(({ size }) => {
  const mainColor = 'var(--ant-color-warning)';
  const ringColor = `color-mix(in srgb, ${'var(--ant-color-warning)'} 35%, transparent)`;
  return (
    <svg aria-hidden fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <circle cx="8" cy="8" r="6.5" stroke={ringColor} strokeWidth="1.5" />
      <path
        d="M14.5 8 A 6.5 6.5 0 0 1 8 14.5"
        fill="none"
        stroke={mainColor}
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          from="0 8 8"
          repeatCount="indefinite"
          to="360 8 8"
          type="rotate"
        />
      </path>
      <circle cx="8" cy="8" fill={mainColor} r="2.5" stroke={ringColor} strokeWidth="1" />
    </svg>
  );
});

interface TopicStatusIconProps {
  size?: number;
  status?: string | null;
}

const TopicStatusIcon = memo<TopicStatusIconProps>(({ size = 16, status }) => {
  if (status === 'running') return <RunningIcon size={size} />;
  const key = (status ?? 'pending') as keyof typeof STATIC_META;
  const meta = STATIC_META[key] ?? STATIC_META.pending;
  return <Icon color={meta.color} icon={meta.icon} size={size} />;
});

export default TopicStatusIcon;
