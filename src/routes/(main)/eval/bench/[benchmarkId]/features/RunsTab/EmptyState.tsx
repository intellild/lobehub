import { Button, Flexbox, Icon, Text } from '@lobehub/ui';
import { Activity, Plus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onCreate: () => void;
}

const EmptyState = memo<EmptyStateProps>(({ onCreate }) => {
  const { t } = useTranslation('eval');

  return (
    <Flexbox className={styles.emptyCard} gap={16}>
      <div className={styles.iconBox}>
        <Icon icon={Activity} size={28} style={{ color: 'var(--ant-color-text-tertiary)' }} />
      </div>
      <Flexbox align="center" gap={4}>
        <Text weight={600}>{t('run.empty.title')}</Text>
        <Text color={'var(--ant-color-text-tertiary)'} fontSize={12}>
          {t('run.empty.descriptionBenchmark')}
        </Text>
      </Flexbox>
      <Button icon={Plus} size="small" type="primary" onClick={onCreate}>
        {t('run.actions.create')}
      </Button>
    </Flexbox>
  );
});

export default EmptyState;
