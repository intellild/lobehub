'use client';

import { Popover } from '@lobehub/ui';
import { type PropsWithChildren } from 'react';
import { memo, Suspense, useState } from 'react';

import { isDesktop } from '@/const/version';

import stylesModule from './index.module.css';
import PanelContent from './PanelContent';
import PanelContentSkeleton from './PanelContentSkeleton';
import UpgradeBadge from './UpgradeBadge';
import { useNewVersion } from './useNewVersion';

const styles: typeof stylesModule & { popover: string } = {
  ...stylesModule,
  popover: [
    stylesModule.popover,
    isDesktop ? stylesModule.popoverDesktop : stylesModule.popoverWeb,
  ].join(' '),
};

const UserPanel = memo<PropsWithChildren>(({ children }) => {
  const hasNewVersion = useNewVersion();
  const [open, setOpen] = useState(false);

  return (
    <Suspense fallback={children}>
      <UpgradeBadge showBadge={hasNewVersion}>
        <Popover
          arrow={false}
          open={open}
          placement="topLeft"
          trigger="click"
          classNames={{
            root: styles.popover,
            content: styles.popoverContent,
          }}
          content={
            <Suspense fallback={<PanelContentSkeleton />}>
              <PanelContent closePopover={() => setOpen(false)} />
            </Suspense>
          }
          onOpenChange={setOpen}
        >
          {children}
        </Popover>
      </UpgradeBadge>
    </Suspense>
  );
});

UserPanel.displayName = 'UserPanel';

export default UserPanel;
