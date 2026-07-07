import { Button, Flexbox, Icon, Text } from '@lobehub/ui';
import { Card } from 'antd';
import { Database, Plus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAddDataset: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ onAddDataset }) => {
  const { t } = useTranslation('eval');

  return (
    <Card className={styles.emptyCard}>
      <div className={styles.iconBox}>
        <Icon icon={Database} size={24} style={{ color: 'var(--ant-color-primary)' }} />
      </div>
      <Flexbox align="center" gap={4}>
        <Text weight={600}>{t('dataset.empty.title')}</Text>
        <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
          {t('dataset.empty.description')}
        </Text>
      </Flexbox>
      <Button icon={Plus} size="small" style={{ marginTop: 16 }} type="primary" onClick={onAddDataset}>
        {t('dataset.actions.addDataset')}
      </Button>
    </Card>
  );
});

export default EmptyState;
