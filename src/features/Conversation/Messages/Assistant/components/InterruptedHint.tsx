
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './InterruptedHint.module.css';

const InterruptedHint = memo(() => {
  const { t } = useTranslation('chat');

  return (
    <div className={styles.container}>
      {t('messageAction.interrupted')} · {t('messageAction.interruptedHint')}
    </div>
  );
});

InterruptedHint.displayName = 'InterruptedHint';

export default InterruptedHint;
