import { Avatar, Center, Flexbox, FluentEmoji, Icon } from '@lobehub/ui';
import { Link2Icon } from 'lucide-react';
import React, { memo } from 'react';

import { ProductLogo } from '@/components/Branding';

import styles from './OAuthApplicationLogo.module.css';

interface OAuthApplicationLogoProps {
  clientDisplayName: string;
  isFirstParty?: boolean;
  logoUrl?: string;
  size?: number;
}

const OAuthApplicationLogo = memo<OAuthApplicationLogoProps>(
  ({ isFirstParty, clientDisplayName, logoUrl, size = 72 }) => {
    return isFirstParty ? (
      <Avatar alt={clientDisplayName} avatar={logoUrl!} shape={'square'} size={size} />
    ) : (
      <Flexbox horizontal align={'center'} gap={8}>
        {logoUrl ? (
          <Avatar alt={clientDisplayName} avatar={logoUrl} size={size} />
        ) : (
          <FluentEmoji emoji={'🔐'} size={size} />
        )}
        <div className={styles.connectorLine} />
        <Center className={styles.connector}>
          <Icon icon={Link2Icon} style={{ color: 'var(--ant-color-text-secondary)', fontSize: 20 }} />
        </Center>
        <div className={styles.connectorLine} />
        <ProductLogo size={size} />
      </Flexbox>
    );
  },
);

export default OAuthApplicationLogo;
