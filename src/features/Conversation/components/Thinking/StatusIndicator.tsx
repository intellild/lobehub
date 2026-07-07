import { Block, Icon } from '@lobehub/ui';
import { AtomIcon, Loader2Icon } from 'lucide-react';
import { memo } from 'react';

interface StatusIndicatorProps {
  showDetail?: boolean;
  thinking?: boolean;
}

const StatusIndicator = memo<StatusIndicatorProps>(({ thinking, showDetail }) => {
  let icon;

  if (thinking) {
    icon = <Icon spin color={'var(--ant-color-text-description)'} icon={Loader2Icon} />;
  } else {
    icon = (
      <Icon color={showDetail ? 'var(--ant-purple)' : 'var(--ant-color-text-description)'} icon={AtomIcon} />
    );
  }

  return (
    <Block
      horizontal
      align={'center'}
      flex={'none'}
      gap={4}
      height={24}
      justify={'center'}
      variant={'outlined'}
      width={24}
      style={{
        fontSize: 12,
      }}
    >
      {icon}
    </Block>
  );
});

export default StatusIndicator;
