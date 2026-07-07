import { Icon, Text } from '@lobehub/ui';
import { Space } from 'antd';
import { Puzzle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './EmptyState.module.css';

export default function PluginEmptyState() {
  const { t } = useTranslation('plugin');

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon icon={Puzzle} size={32} />
      </div>
      <Text as={'h4'} className={styles.title}>
        {t('dev.preview.empty.title')}
      </Text>
      <Text className={styles.description}>{t('dev.preview.empty.desc')}</Text>
      <Space align="center" orientation="vertical">
        <div className={styles.line} style={{ width: 128 }} />
        <div className={styles.line} style={{ width: 96 }} />
        <div className={styles.line} style={{ width: 48 }} />
      </Space>
    </div>
  );
}
