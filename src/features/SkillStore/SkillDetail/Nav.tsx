'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { Tabs } from '@lobehub/ui/base-ui';
import { BookOpenIcon, BotIcon, CodeIcon } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Nav.module.css';

export type TabKey = 'agents' | 'overview' | 'schema';

interface NavProps {
  activeTab?: TabKey;
  mobile?: boolean;
  setActiveTab?: (tab: TabKey) => void;
}

const Nav = memo<NavProps>(({ activeTab = 'overview', setActiveTab }) => {
  const { t } = useTranslation('plugin');

  const items = useMemo(
    () => [
      {
        icon: <Icon icon={BookOpenIcon} size={16} />,
        key: 'overview',
        label: t('skillDetail.tabs.overview'),
      },
      {
        icon: <Icon icon={CodeIcon} size={16} />,
        key: 'schema',
        label: t('skillDetail.tabs.tools'),
      },
      {
        icon: <Icon icon={BotIcon} size={16} />,
        key: 'agents',
        label: t('skillDetail.tabs.agents'),
      },
    ],
    [t],
  );

  return (
    <Flexbox className={styles.nav}>
      <Tabs
        activeKey={activeTab}
        className={styles.tabs}
        items={items}
        onChange={(key) => setActiveTab?.(key as TabKey)}
      />
    </Flexbox>
  );
});

export default Nav;
