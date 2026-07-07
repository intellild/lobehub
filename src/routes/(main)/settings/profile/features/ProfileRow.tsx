'use client';

import { Text } from '@lobehub/ui';
import { type ReactNode } from 'react';

import styles from './ProfileRow.module.css';

interface ProfileRowProps {
  action?: ReactNode;
  children?: ReactNode;
  label?: string;
  labelSlot?: ReactNode;
}

const ProfileRow = ({ label, labelSlot, children, action }: ProfileRowProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{labelSlot ?? (label && <Text strong>{label}</Text>)}</div>
      <div className={styles.body}>
        {children}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
};

export default ProfileRow;
