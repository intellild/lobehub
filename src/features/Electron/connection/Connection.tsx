import { Center, Flexbox } from '@lobehub/ui';
import { Drawer } from 'antd';
import { Suspense, useCallback } from 'react';

import { BrandTextLoading } from '@/components/Loading';
import LoginStep from '@/routes/(desktop)/desktop-onboarding/features/LoginStep';
import { useElectronStore } from '@/store/electron';
import { isMacOS } from '@/utils/platform';

import stylesModule from './Connection.module.css';
import RemoteStatus from './RemoteStatus';

const isMac = isMacOS();

const styles: { modal: string } = {
  modal: [stylesModule.modal, isMac ? stylesModule.modalMac : stylesModule.modalDefault].join(' '),
};

const Connection = () => {
  const [isOpen, setConnectionDrawerOpen] = useElectronStore((s) => [
    s.isConnectionDrawerOpen,
    s.setConnectionDrawerOpen,
  ]);

  const handleClose = useCallback(() => {
    setConnectionDrawerOpen(false);
  }, [setConnectionDrawerOpen]);

  return (
    <>
      <RemoteStatus
        onClick={() => {
          setConnectionDrawerOpen(true);
        }}
      />
      <Drawer
        classNames={{ header: styles.modal }}
        open={isOpen}
        placement={'top'}
        size={'100vh'}
        styles={{ body: { padding: 0 }, header: { padding: 0 } }}
        style={{
          background: 'var(--ant-color-bg-layout)',
        }}
        onClose={handleClose}
      >
        <Suspense
          fallback={
            <Center style={{ height: '100%' }}>
              <BrandTextLoading debugId="Connection" />
            </Center>
          }
        >
          <Center style={{ height: '100%', overflow: 'auto', padding: 24 }}>
            <Flexbox style={{ maxWidth: 560, width: '100%' }}>
              <LoginStep onBack={handleClose} onNext={handleClose} />
            </Flexbox>
          </Center>
        </Suspense>
      </Drawer>
    </>
  );
};

export default Connection;
