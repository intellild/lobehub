'use client';

import { Flexbox } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import ImperativeModal from '@/components/ImperativeModal';
import { PortalContent } from '@/features/Portal/router';
import { useChatStore } from '@/store/chat';
import { portalThreadSelectors } from '@/store/chat/selectors';

import styles from './Mobile.module.css';

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

const Layout = () => {
  const [showMobilePortal, isPortalThread, clearPortalStack] = useChatStore((s) => [
    s.showPortal,
    portalThreadSelectors.showThread(s),
    s.clearPortalStack,
  ]);
  const { t } = useTranslation('portal');

  const renderBody = (body: ReactNode) => (
    <Flexbox gap={8} height={'calc(100% - 52px)'} padding={'0 8px'} style={{ overflow: 'hidden' }}>
      <Flexbox
        height={'100%'}
        style={{ marginInline: -8, overflow: 'hidden', position: 'relative' }}
        width={'calc(100% + 16px)'}
      >
        {body}
      </Flexbox>
    </Flexbox>
  );

  return (
    <ImperativeModal
      allowFullscreen
      destroyOnHidden
      className={cx(isPortalThread && styles.container)}
      footer={null}
      height={'95%'}
      open={showMobilePortal}
      title={t('title')}
      styles={{
        body: { padding: 0 },
        header: { display: 'none' },
      }}
      onCancel={() => clearPortalStack()}
    >
      <PortalContent renderBody={renderBody} />
    </ImperativeModal>
  );
};

export default Layout;
