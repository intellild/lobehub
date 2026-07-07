'use client';

import { DraggablePanel } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo, Suspense, useMemo, useRef } from 'react';

import NavPanelUpgradeEntry from '@/business/client/features/NavPanelUpgradeEntry';
import { isDesktop } from '@/const/version';
import Footer from '@/routes/(main)/home/_layout/Footer';
import { useGlobalStore } from '@/store/global';
import {
  NAV_PANEL_MAX_WIDTH,
  NAV_PANEL_MIN_WIDTH,
  systemStatusSelectors,
} from '@/store/global/selectors';
import { isMacOS } from '@/utils/platform';

import { useNavPanelSizeChangeHandler } from '../hooks/useNavPanel';
import draggableStylesModule from './NavPanelDraggable.module.css';

const draggableStyles: typeof draggableStylesModule & { panel: string } = {
  ...draggableStylesModule,
  panel: [
    draggableStylesModule.panel,
    isDesktop && isMacOS()
      ? draggableStylesModule.panelTransparent
      : draggableStylesModule.panelLayoutBackground,
  ].join(' '),
};

interface NavPanelDraggableProps {
  activeContent: {
    key: string;
    node: ReactNode;
  };
}

const classNames = {
  content: draggableStyles.content,
};

export const NavPanelDraggable = memo<NavPanelDraggableProps>(({ activeContent }) => {
  const [expand, togglePanel, isStatusInit] = useGlobalStore((s) => [
    systemStatusSelectors.showLeftPanel(s),
    s.toggleLeftPanel,
    systemStatusSelectors.isStatusInit(s),
  ]);
  const handleSizeChange = useNavPanelSizeChangeHandler();

  // Defer DraggablePanel mount until system status hydrates; otherwise defaultSize
  // captures the pre-hydration default and the DOM drifts off NavigationBar's live width.
  const defaultWidthRef = useRef(0);
  if (defaultWidthRef.current === 0 && isStatusInit) {
    defaultWidthRef.current = systemStatusSelectors.leftPanelWidth(useGlobalStore.getState());
  }

  const styles = useMemo(
    () => ({
      background: isDesktop && isMacOS() ? 'transparent' : 'var(--ant-color-bg-layout)',
      zIndex: 11,
    }),
    [],
  );

  if (defaultWidthRef.current === 0) {
    const pendingWidth = systemStatusSelectors.leftPanelWidth(useGlobalStore.getState());
    return <div aria-hidden style={{ flexShrink: 0, height: '100%', width: pendingWidth }} />;
  }

  const defaultSize = { height: '100%', width: defaultWidthRef.current };

  return (
    <DraggablePanel
      className={draggableStyles.panel}
      classNames={classNames}
      defaultSize={defaultSize}
      expand={expand}
      expandable={false}
      maxWidth={NAV_PANEL_MAX_WIDTH}
      minWidth={NAV_PANEL_MIN_WIDTH}
      placement="left"
      showBorder={false}
      style={styles}
      onExpandChange={togglePanel}
      onSizeDragging={handleSizeChange}
    >
      <div className={draggableStyles.inner}>
        <div className={draggableStyles.layer} key={activeContent.key}>
          {activeContent.node}
        </div>
      </div>
      <Suspense fallback={null}>
        <NavPanelUpgradeEntry />
      </Suspense>
      <Suspense>
        <Footer />
      </Suspense>
    </DraggablePanel>
  );
});
