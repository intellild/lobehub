'use client';

import { Button, Icon } from '@lobehub/ui';
import { confirmModal } from '@lobehub/ui/base-ui';
import { App } from 'antd';
import { Brain, ChartBar, MessageSquare, Play } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useEvalStore } from '@/store/eval';

import styles from './index.module.css';

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

interface IdleStateProps {
  run: { id: string; status: string };
}

const IdleState = memo<IdleStateProps>(({ run }) => {
  const { t } = useTranslation('eval');
  const { message } = App.useApp();
  const startRun = useEvalStore((s) => s.startRun);
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    confirmModal({
      content: t('run.actions.start.confirm'),
      okText: t('run.actions.start'),
      onOk: async () => {
        try {
          setStarting(true);
          await startRun(run.id, run.status !== 'idle');
        } catch (error: any) {
          message.error(error?.message || 'Failed to start run');
        } finally {
          setStarting(false);
        }
      },
      title: t('run.actions.start'),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.orbitGroup}>
        <div className={cx(styles.orbit, styles.orbit1)} />
        <div className={cx(styles.orbit, styles.orbit2)} />
        <div className={cx(styles.orbit, styles.orbit3)} />
        <div className={cx(styles.icon, styles.icon1)}>
          <Icon icon={Brain} size={16} />
        </div>
        <div className={cx(styles.icon, styles.icon2)}>
          <Icon icon={MessageSquare} size={16} />
        </div>
        <div className={cx(styles.icon, styles.icon3)}>
          <Icon icon={ChartBar} size={16} />
        </div>
        <div className={styles.center}>
          <Icon icon={Play} size={18} />
        </div>
      </div>
      <div className={styles.hint}>{t('run.idle.hint')}</div>
      <Button
        icon={<Play size={14} />}
        loading={starting}
        style={{ marginTop: 12 }}
        type="primary"
        onClick={handleStart}
      >
        {t('run.actions.start')}
      </Button>
    </div>
  );
});

export default IdleState;
