'use client';

import { Flexbox, Tag } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ChannelPlatformDefinition } from '../const';
import { getPlatformIcon } from '../const';
import styles from './ComingSoon.module.css';

interface ComingSoonDetailProps {
  platformDef: ChannelPlatformDefinition;
}

const ComingSoonDetail = memo<ComingSoonDetailProps>(({ platformDef }) => {
  const { t } = useTranslation('agent');
  const PlatformIcon = getPlatformIcon(platformDef.name);
  const ColorIcon =
    PlatformIcon && 'Color' in PlatformIcon ? (PlatformIcon as any).Color : PlatformIcon;

  return (
    <main className={styles.main}>
      <Flexbox horizontal align="center" className={styles.header} gap={8}>
        {ColorIcon && <ColorIcon size={32} />}
        {platformDef.name}
        <Tag size={'small'}>{t('channel.comingSoon')}</Tag>
      </Flexbox>
      <div className={styles.placeholder}>
        {ColorIcon && <ColorIcon size={64} />}
        <div className={styles.title}>
          {t('channel.comingSoonTitle', { name: platformDef.name })}
        </div>
        <div className={styles.desc}>{t('channel.comingSoonDesc')}</div>
      </div>
    </main>
  );
});

export default ComingSoonDetail;
