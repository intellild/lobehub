'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { ArrowLeft } from 'lucide-react';
import { type CSSProperties } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import WorkspaceLink from '@/features/Workspace/WorkspaceLink';

import styles from './Back.module.css';

const Back = memo<{ href: string; style?: CSSProperties }>(({ href, style }) => {
  const { t } = useTranslation('discover');

  return (
    <WorkspaceLink className={styles.back} style={{ marginBottom: 8, ...style }} to={href}>
      <Flexbox horizontal align={'center'} gap={8}>
        <Icon icon={ArrowLeft} />
        {t(`back`)}
      </Flexbox>
    </WorkspaceLink>
  );
});

export default Back;
