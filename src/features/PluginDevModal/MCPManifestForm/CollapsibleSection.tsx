
import { ChevronDown, ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { useState } from 'react';

import styles from './CollapsibleSection.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

interface CollapsibleSectionProps {
  /** Child component content */
  children: ReactNode;
  /** Whether expanded by default */
  defaultExpanded?: boolean;
  /** Title text */
  title: string;
}

const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
}: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.container}>
      <div className={cx(styles.header)} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className={styles.title}>{title}</span>
      </div>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
