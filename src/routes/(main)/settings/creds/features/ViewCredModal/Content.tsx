'use client';

import { type UserCredSummary } from '@lobechat/types';
import { CopyButton, Flexbox } from '@lobehub/ui';
import { useQuery } from '@tanstack/react-query';
import { Alert, Descriptions, Skeleton, Typography } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCredsApi } from '../useCredsApi';
import styles from './Content.module.css';

type LobeClassValue = false | null | string | undefined | Record<string, boolean | null | undefined>;

const cx = (...classes: LobeClassValue[]) =>
  classes
    .flatMap((className) => {
      if (!className) return [];
      if (typeof className === 'string') return [className];
      return Object.entries(className)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key);
    })
    .join(' ');

const { Text } = Typography;

const maskValue = (value: string): string => {
  if (value.length <= 4) return '••••••••';
  return '••••••••' + value.slice(-4);
};

interface KVRowProps {
  keyName: string;
  value: string;
}

const KVRow: FC<KVRowProps> = ({ keyName, value }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.kvRow}>
      <div className={styles.kvKey}>{keyName}</div>
      <div className={styles.kvValue}>
        <Text
          className={cx(!visible && styles.maskedValue)}
          style={{
            flex: 1,
            fontFamily: 'var(--lobe-font-family-code)',
            fontSize: 13,
            wordBreak: 'break-all',
          }}
        >
          {visible ? value : maskValue(value)}
        </Text>
        <Flexbox horizontal align={'center'} gap={4}>
          <div className={styles.toggleBtn} onClick={() => setVisible(!visible)}>
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
          <CopyButton content={value} size={'small'} />
        </Flexbox>
      </div>
    </div>
  );
};

export interface ViewCredModalContentProps {
  cred: UserCredSummary;
}

const ViewCredModalContent: FC<ViewCredModalContentProps> = ({ cred }) => {
  const { t } = useTranslation('setting');
  const credsApi = useCredsApi();

  const { data, isLoading, error } = useQuery({
    queryFn: () =>
      credsApi.client.get.query({
        decrypt: true,
        id: cred.id,
      }),
    queryKey: ['cred-plaintext', cred.id],
  });

  const values = (data as any)?.plaintext || {};
  const valueEntries = Object.entries(values);

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (error) {
    return (
      <Alert
        showIcon
        description={(error as Error).message}
        message={t('creds.view.error')}
        type={'error'}
      />
    );
  }

  return (
    <>
      <Alert
        showIcon
        message={t('creds.view.warning')}
        style={{ marginBottom: 16 }}
        type={'warning'}
      />
      <Descriptions bordered column={1} size={'small'}>
        <Descriptions.Item label={t('creds.table.name')}>{cred.name}</Descriptions.Item>
        <Descriptions.Item label={t('creds.table.key')}>
          <code>{cred.key}</code>
        </Descriptions.Item>
        <Descriptions.Item label={t('creds.table.type')}>
          {cred.type ? t(`creds.types.${cred.type}` as any) : '-'}
        </Descriptions.Item>
      </Descriptions>

      {valueEntries.length > 0 && (
        <div className={styles.valuesSection}>
          <div className={styles.valuesTitle}>{t('creds.view.values')}</div>
          {valueEntries.map(([key, value]) => (
            <KVRow key={key} keyName={key} value={String(value)} />
          ))}
        </div>
      )}

      {valueEntries.length === 0 && cred.type === 'oauth' && (
        <Alert
          showIcon
          description={t('creds.view.oauthNote')}
          message={t('creds.view.noValues')}
          style={{ marginTop: 16 }}
          type={'info'}
        />
      )}
    </>
  );
};

export default ViewCredModalContent;
