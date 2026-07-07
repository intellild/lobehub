import { type BriefType } from '@lobechat/types';
import { Block, Icon } from '@lobehub/ui';
import type { CircleDot } from 'lucide-react';
import { CheckCheckIcon, EyeIcon, HandIcon, Lightbulb, SirenIcon } from 'lucide-react';
import { memo } from 'react';

const BRIEF_TYPE_ICON: Record<BriefType, typeof CircleDot> = {
  decision: HandIcon,
  error: SirenIcon,
  insight: EyeIcon,
  result: CheckCheckIcon,
};

const BRIEF_TYPE_COLOR: Record<BriefType, string | undefined> = {
  decision: 'var(--ant-color-info)',
  error: 'var(--ant-color-error)',
  insight: 'var(--ant-color-info)',
  result: 'var(--ant-color-success)',
} as const;

const BRIEF_TYPE_COLOR_BG: Record<BriefType, string | undefined> = {
  decision: 'var(--ant-color-info-bg-hover)',
  error: 'var(--ant-color-error-bg-hover)',
  insight: 'var(--ant-color-info-bg-hover)',
  result: 'var(--ant-color-success-bg-hover)',
} as const;

interface BriefIconProps {
  muted?: boolean;
  size?: number;
  type: BriefType;
}

const BriefIcon = memo<BriefIconProps>(({ size = 28, type, muted = false }) => {
  const icon = BRIEF_TYPE_ICON[type] || Lightbulb;
  const color = muted ? 'var(--ant-color-text-quaternary)' : BRIEF_TYPE_COLOR[type] || 'var(--ant-color-primary)';
  const background = muted ? 'var(--ant-color-fill-quaternary)' : BRIEF_TYPE_COLOR_BG[type];

  return (
    <Block align={'center'} height={size} justify={'center'} style={{ background }} width={size}>
      <Icon color={color} icon={icon} size={size * 0.6} />
    </Block>
  );
});

export default BriefIcon;
