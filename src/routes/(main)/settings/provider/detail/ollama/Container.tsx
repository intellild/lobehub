import { ActionIcon, Flexbox } from '@lobehub/ui';
import { XIcon } from 'lucide-react';
import { type ReactNode } from 'react';
import { useState } from 'react';

import styles from './Container.module.css';

const Container = ({
  setError,
  children,
}: {
  children: ReactNode;
  setError: (error?: any) => void;
}) => {
  const [show, setShow] = useState(true);

  return (
    show && (
      <Flexbox className={styles.container}>
        <ActionIcon
          className={styles.close}
          icon={XIcon}
          onClick={() => {
            setShow(false);
            setError(undefined);
          }}
        />
        {children}
      </Flexbox>
    )
  );
};

export default Container;
