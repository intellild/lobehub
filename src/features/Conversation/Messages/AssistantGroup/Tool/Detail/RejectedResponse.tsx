import { Flexbox, Icon } from '@lobehub/ui';
import { AlertTriangle } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './RejectedResponse.module.css';

interface RejectedResponseProps {
  reason?: string;
}

const RejectedResponse = memo<RejectedResponseProps>(({ reason }) => {
  const { t } = useTranslation('chat');

  return (
    <Flexbox className={styles.container} gap={8}>
      <Flexbox horizontal align={'center'} gap={8}>
        <Icon color={'var(--ant-color-warning)'} icon={AlertTriangle} size={16} />
        <div className={styles.title}>
          {reason
            ? t('tool.intervention.rejectedWithReason', { reason })
            : t('tool.intervention.toolRejected')}
        </div>
      </Flexbox>
    </Flexbox>
  );
});

export default RejectedResponse;
