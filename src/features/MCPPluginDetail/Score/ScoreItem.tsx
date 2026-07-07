import { Flexbox, Icon } from '@lobehub/ui';
import { BanIcon, CircleCheckBigIcon, CircleDashedIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import Title from '@/routes/(main)/community/features/Title';

export interface ScoreItemProps {
  check: boolean;
  desc: ReactNode;
  key: string;
  required?: boolean;
  title: ReactNode;
}

const ScoreItem = memo<ScoreItemProps>(({ required, check, desc, title }) => {
  return (
    <Flexbox horizontal align={'center'} gap={16} paddingInline={16}>
      <Icon
        icon={check ? CircleCheckBigIcon : required ? BanIcon : CircleDashedIcon}
        size={24}
        color={
          check ? 'var(--ant-color-success)' : required ? 'var(--ant-color-error)' : 'var(--ant-color-text-quaternary)'
        }
      />
      <Flexbox gap={4}>
        <Title level={3}>{title}</Title>
        <p style={{ color: 'var(--ant-color-text-secondary)', margin: 0 }}>{desc}</p>
      </Flexbox>
    </Flexbox>
  );
});

export default ScoreItem;
