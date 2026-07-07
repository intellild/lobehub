import { Text } from '@lobehub/ui';
import { memo } from 'react';

import styles from './PersonaHeader.module.css';

const PersonaHeader = memo(() => {
  return (
    <Text as={'h1'} className={styles.title}>
      Persona
    </Text>
  );
});

export default PersonaHeader;
