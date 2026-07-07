import { ActionIcon, CopyButton, Flexbox } from '@lobehub/ui';
import { X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './TestCasePreviewPanel.module.css';

interface TestCasePreviewPanelProps {
  onClose: () => void;
  testCase: any;
}

const TestCasePreviewPanel = memo<TestCasePreviewPanelProps>(({ testCase, onClose }) => {
  const { t } = useTranslation('eval');

  return (
    <Flexbox className={styles.container} height="100%">
      <div className={styles.header}>
        <p className={styles.title}>{t('testCase.preview.title')}</p>
        <ActionIcon icon={X} size="small" onClick={onClose} />
      </div>
      <div className={styles.content}>
        <Flexbox gap={16}>
          <Flexbox gap={4}>
            <Flexbox horizontal align="center" justify="space-between">
              <p className={styles.fieldLabel}>{t('testCase.preview.input')}</p>
              {testCase.content?.input && (
                <CopyButton content={testCase.content.input} size="small" />
              )}
            </Flexbox>
            <div className={styles.fieldValue}>{testCase.content?.input}</div>
          </Flexbox>
          {testCase.content?.expected && (
            <Flexbox gap={4}>
              <Flexbox horizontal align="center" justify="space-between">
                <p className={styles.fieldLabel}>{t('testCase.preview.expected')}</p>
                <CopyButton content={testCase.content.expected} size="small" />
              </Flexbox>
              <div className={styles.fieldValue}>{testCase.content.expected}</div>
            </Flexbox>
          )}
          {testCase.content?.category && (
            <Flexbox gap={4}>
              <p className={styles.fieldLabel}>{t('table.columns.category')}</p>
              <div className={styles.fieldValue}>{testCase.content.category}</div>
            </Flexbox>
          )}
        </Flexbox>
      </div>
    </Flexbox>
  );
});

export default TestCasePreviewPanel;
