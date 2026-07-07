import { Button, Flexbox, Text } from '@lobehub/ui';
import { Database, FileUp, Plus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './TestCaseEmptyState.module.css';

interface TestCaseEmptyStateProps {
  onAddCase: () => void;
  onImport: () => void;
}

const TestCaseEmptyState = memo<TestCaseEmptyStateProps>(({ onAddCase, onImport }) => {
  const { t } = useTranslation('eval');

  return (
    <Flexbox align="center" gap={8} justify="center" style={{ padding: '48px 24px' }}>
      <div className={styles.emptyIcon}>
        <Database size={20} style={{ color: 'var(--ant-color-primary)' }} />
      </div>
      <Text weight={600}>{t('testCase.empty.title')}</Text>
      <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
        {t('testCase.empty.description')}
      </Text>
      <Flexbox horizontal gap={8} style={{ marginTop: 8 }}>
        <Button icon={Plus} size="small" onClick={onAddCase}>
          {t('testCase.actions.add')}
        </Button>
        <Button icon={FileUp} size="small" type="primary" onClick={onImport}>
          {t('testCase.actions.import')}
        </Button>
      </Flexbox>
    </Flexbox>
  );
});

export default TestCaseEmptyState;
