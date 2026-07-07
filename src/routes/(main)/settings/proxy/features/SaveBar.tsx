'use client';

import { Button } from 'antd';
import { AnimatePresence, m } from 'motion/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SaveBar.module.css';

interface SaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
}

const SaveBar = memo<SaveBarProps>(({ isDirty, isSaving, onReset, onSave }) => {
  const { t } = useTranslation('electron');

  return (
    <AnimatePresence>
      {isDirty && (
        <m.div
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className={styles.container}
          exit={{ opacity: 0, y: 16 }}
          initial={{ opacity: 0, y: 16 }}
          role="status"
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <div className={styles.pill}>
            <span className={styles.dot} />
            <span className={styles.message}>{t('proxy.unsavedChanges')}</span>
            <Button
              className={styles.resetButton}
              disabled={isSaving}
              size="small"
              type="text"
              onClick={onReset}
            >
              {t('proxy.resetButton')}
            </Button>
            <Button
              className={styles.saveButton}
              loading={isSaving}
              size="small"
              type="primary"
              onClick={onSave}
            >
              {t('proxy.saveButton')}
            </Button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
});

SaveBar.displayName = 'SaveBar';

export default SaveBar;
