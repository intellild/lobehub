import { ActionIcon, Button, Flexbox } from '@lobehub/ui';
import { ChevronLeftIcon } from 'lucide-react';
import { type MouseEvent, type PropsWithChildren, type ReactNode, useCallback } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { isModifierClick } from '@/utils/navigation';

import ToggleLeftPanelButton from '../ToggleLeftPanelButton';
import styles from './BackNav.module.css';

const BackLink = ({ children }: { children: ReactNode }) => {
  const navigate = useWorkspaceAwareNavigate();
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (isModifierClick(e)) return;
      e.preventDefault();
      navigate('/');
    },
    [navigate],
  );

  return (
    <Link to="/" onClick={handleClick}>
      {children}
    </Link>
  );
};

const BackNav = memo<PropsWithChildren>(({ children }) => {
  const { t } = useTranslation('common');
  const leftContent = children ? (
    <Flexbox horizontal align={'center'} gap={4}>
      <BackLink>
        <ActionIcon icon={ChevronLeftIcon} size={DESKTOP_HEADER_ICON_SIZE} />
      </BackLink>
      {children}
    </Flexbox>
  ) : (
    <BackLink>
      <Button className={styles.button} icon={ChevronLeftIcon} type={'text'}>
        {t('back')}
      </Button>
    </BackLink>
  );

  return (
    <Flexbox horizontal align={'center'} gap={4} justify={'space-between'} padding={8}>
      {leftContent}
      <ToggleLeftPanelButton />
    </Flexbox>
  );
});

export default BackNav;
