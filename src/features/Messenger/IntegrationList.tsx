'use client';

import { Block, Flexbox, Icon, Text } from '@lobehub/ui';
import { ChevronRightIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { SerializedMessengerPlatformDefinition } from '@/server/services/messenger/platforms/types';

import { type MessengerPlatform, PlatformAvatar } from './constants';
import styles from './IntegrationList.module.css';

interface IntegrationListProps {
  onSelect: (platform: MessengerPlatform) => void;
  platforms: SerializedMessengerPlatformDefinition[];
}

const IntegrationList = memo<IntegrationListProps>(({ onSelect, platforms }) => {
  const { t } = useTranslation('messenger');

  return (
    <div className={styles.grid}>
      {platforms.map((platform) => (
        <Block className={styles.card} key={platform.id} onClick={() => onSelect(platform.id)}>
          <Flexbox horizontal align="center" gap={16}>
            <PlatformAvatar platform={platform.id} size={48} />
            <Flexbox flex={1} gap={2}>
              <Text strong style={{ fontSize: 15 }}>
                {platform.name}
              </Text>
              <Text style={{ fontSize: 13 }} type="secondary">
                {t(`messenger.list.${platform.id}.description` as any)}
              </Text>
            </Flexbox>
            <Icon icon={ChevronRightIcon} />
          </Flexbox>
        </Block>
      ))}
    </div>
  );
});

IntegrationList.displayName = 'MessengerIntegrationList';

export default IntegrationList;
