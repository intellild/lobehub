'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox, Icon } from '@lobehub/ui';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import { useServerConfigStore } from '@/store/serverConfig';

import CardBanner from '../../components/CardBanner';
import styles from './HighlightBlock.module.css';

interface HighlightBlockProps extends FlexboxProps {
  avatar?: string | ReactNode;
  icon: LucideIcon;
  title: string;
}

const HighlightBlock = memo<HighlightBlockProps>(({ avatar, title, icon, children, ...rest }) => {
  const mobile = useServerConfigStore((s) => s.isMobile);
  return (
    <Flexbox className={styles.container} flex={'none'} width={'100%'} {...rest}>
      <Flexbox
        horizontal
        align={'center'}
        className={styles.header}
        flex={'none'}
        gap={12}
        padding={16}
      >
        <Icon icon={icon} size={20} style={{ zIndex: 1 }} />
        <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: 0, zIndex: 1 }}>{title}</h2>
        <CardBanner avatar={avatar} className={styles.background} size={mobile ? 64 : 512} />
      </Flexbox>
      {children}
    </Flexbox>
  );
});

export default HighlightBlock;
