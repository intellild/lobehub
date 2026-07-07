'use client';

import { type UserCredSummary } from '@lobechat/types';
import { Button, Flexbox } from '@lobehub/ui';
import { useMutation } from '@tanstack/react-query';
import { Empty, Spin } from 'antd';
import { LogIn } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import AsyncBoundary from '@/components/AsyncBoundary';
import { usePermission } from '@/hooks/usePermission';
import { useMarketAuth } from '@/layout/AuthProvider/MarketAuth';

import CredItem from './CredItem';
import styles from './CredsList.module.css';
import { createEditCredModal } from './EditCredModal';
import { useCredsApi } from './useCredsApi';
import { createViewCredModal } from './ViewCredModal';

const CredsList: FC = () => {
  const { t } = useTranslation('setting');
  const { isAuthenticated, isLoading: isAuthLoading, signIn } = useMarketAuth();
  const { allowed: canManageCredentials } = usePermission('manage_provider_key');
  const credsApi = useCredsApi();

  const { data, isLoading, error, refetch } = credsApi.query.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!canManageCredentials) return;
      await credsApi.client.delete.mutate({ id });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const credentials = data?.data ?? [];

  const handleEdit = (cred: UserCredSummary) => {
    createEditCredModal({
      cred,
      onSuccess: () => refetch(),
    });
  };

  const handleView = (cred: UserCredSummary) => {
    createViewCredModal({ cred });
  };

  if (isAuthLoading) {
    return (
      <Flexbox align={'center'} justify={'center'} style={{ padding: 48 }}>
        <Spin />
      </Flexbox>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.signInPrompt}>
        <Empty description={t('creds.signInRequired')} />
        <Button icon={LogIn} type={'primary'} onClick={() => signIn()}>
          {t('creds.signIn')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AsyncBoundary
        data={data}
        empty={<Empty className={styles.empty} description={t('creds.empty')} />}
        error={error}
        errorVariant={'block'}
        isEmpty={credentials.length === 0}
        isLoading={isLoading}
        loading={
          <Flexbox align={'center'} justify={'center'} style={{ padding: 48 }}>
            <Spin />
          </Flexbox>
        }
        onRetry={() => refetch()}
      >
        <Flexbox gap={0}>
          {credentials.map((cred) => (
            <CredItem
              cred={cred}
              key={cred.id}
              onDelete={(id) => deleteMutation.mutate(id)}
              onView={handleView}
              onEdit={(cred) => {
                if (!canManageCredentials) return;
                handleEdit(cred);
              }}
            />
          ))}
        </Flexbox>
      </AsyncBoundary>
    </div>
  );
};

export default CredsList;
