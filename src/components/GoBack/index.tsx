import { Flexbox, Icon } from '@lobehub/ui';
import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import styles from './index.module.css';

interface GoBackProps {
  href: string;
}

const GoBack = memo<GoBackProps>(({ href }) => {
  const { t } = useTranslation('components');

  return (
    <Link to={href}>
      <Flexbox horizontal align={'center'} className={styles.container} gap={4}>
        <Icon icon={ArrowLeft} />
        <div>{t('GoBack.back')}</div>
      </Flexbox>
    </Link>
  );
});

export default GoBack;
