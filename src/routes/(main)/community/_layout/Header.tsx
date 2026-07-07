import { Flexbox } from '@lobehub/ui';
import { memo, useMemo } from 'react';

import { isCustomBranding } from '@/const/version';
import NavHeader from '@/features/NavHeader';
import { useTheme } from '@/hooks/useTheme';

import CreateButton from '../features/CreateButton';
import StoreSearchBar from '../features/Search';
import UserAvatar from '../features/UserAvatar';
import { styles } from './Header/style';

const Header = memo(() => {
  const theme = useTheme(); // Keep for colorBgContainerSecondary, which is set dynamically below.
  const cssVariables = useMemo<Record<string, string>>(
    () => ({
      '--header-bg': theme.colorBgContainerSecondary,
      '--header-border-color': 'var(--ant-color-border-secondary)',
    }),
    [theme.colorBgContainerSecondary],
  );

  return (
    <NavHeader
      className={styles.headerContainer}
      style={cssVariables}
      right={
        <Flexbox horizontal align="center" gap={8}>
          {!isCustomBranding && <CreateButton />}
          <UserAvatar />
        </Flexbox>
      }
      styles={{
        center: { flex: 1, maxWidth: 720 },
        left: { flex: 1, maxWidth: 120 },
        right: { flex: 1, maxWidth: 160 },
      }}
    >
      <StoreSearchBar />
    </NavHeader>
  );
});

export default Header;
