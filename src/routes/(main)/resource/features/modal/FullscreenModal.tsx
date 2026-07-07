'use client';

import { ConfigProvider } from 'antd';
import { type ReactNode } from 'react';
import { useCallback, useState } from 'react';

import ImperativeModal from '@/components/ImperativeModal';

import styles from './FullscreenModal.module.css';

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

interface FullscreenModalProps {
  children: ReactNode;
  detail?: ReactNode;
  onClose?: () => void;
}

const FullscreenModal = ({ children, detail, onClose }: FullscreenModalProps) => {
  const [open, setOpen] = useState(true);
  const showDetail = !!detail;

  const handleCancel = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <ConfigProvider theme={{ token: { motion: false } }}>
        <ImperativeModal
          className={cx(styles.modal, showDetail && styles.modal_withDetail)}
          classNames={{ body: styles.body, header: styles.header, wrapper: styles.content }}
          footer={false}
          open={open}
          width={'auto'}
          onCancel={handleCancel}
        >
          {children}
        </ImperativeModal>
      </ConfigProvider>
      {!!detail && <div className={styles.extra}>{detail}</div>}
    </>
  );
};
export default FullscreenModal;
