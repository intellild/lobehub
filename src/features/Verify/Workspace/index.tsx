'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { PanelLeftOpen } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { RouteMetaBridge } from '@/features/RouteMeta';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/slices/auth/selectors';

import styles from './index.module.css';
import ReportListPanel from './ReportListPanel';

/**
 * Verify workspace shell — a master-detail layout: a persistent, collapsible /
 * drag-resizable report-list panel on the left, and the selected report (or the
 * empty placeholder) rendered through the router `Outlet` on the right.
 */
const VerifyWorkspace = memo(() => {
  const { t } = useTranslation('verify');
  const [showPanel, updateSystemStatus] = useGlobalStore((s) => [
    systemStatusSelectors.showVerifyReportPanel(s),
    s.updateSystemStatus,
  ]);
  const isAuthLoaded = useUserStore(authSelectors.isLoaded);
  const isLogin = useUserStore(authSelectors.isLogin);
  const canShowReportList = Boolean(isAuthLoaded && isLogin);

  return (
    <Flexbox horizontal height={'100dvh'} style={{ overflow: 'hidden' }} width={'100%'}>
      {/* Standalone route (outside the app main layout): drive the tab title here. */}
      <RouteMetaBridge />
      {canShowReportList && <ReportListPanel />}
      <div className={styles.main}>
        {canShowReportList && !showPanel && (
          <button
            aria-label={t('workspace.expand')}
            className={styles.expandBtn}
            title={t('workspace.expand')}
            type={'button'}
            onClick={() => updateSystemStatus({ showVerifyReportPanel: true })}
          >
            <Icon icon={PanelLeftOpen} size={16} />
          </button>
        )}
        <Outlet />
      </div>
    </Flexbox>
  );
});

VerifyWorkspace.displayName = 'VerifyWorkspace';

export default VerifyWorkspace;
