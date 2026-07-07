
import { memo } from 'react';

import styles from './PersonaSummary.module.css';

interface PersonaSummaryProps {
  children: string;
}

const PersonaSummary = memo<PersonaSummaryProps>(({ children }) => {
  return <div className={styles.summary}>{children}</div>;
});

export default PersonaSummary;
