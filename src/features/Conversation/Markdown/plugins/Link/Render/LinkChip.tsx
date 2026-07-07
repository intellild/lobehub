'use client';
import { memo, type ReactNode } from 'react';

import styles from './LinkChip.module.css';

interface LinkChipProps {
  href?: string;
  icon?: ReactNode;
  label: string;
}

const LinkChip = memo<LinkChipProps>(({ href, icon, label }) => (
  <a className={styles.chip} href={href} rel="noopener noreferrer" target="_blank">
    {icon && <span className={styles.icon}>{icon}</span>}
    {label}
  </a>
));

LinkChip.displayName = 'LinkChip';

export default LinkChip;
