'use client';

import { ActionIcon, Flexbox } from '@lobehub/ui';
import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { electronSystemService } from '@/services/electron/system';
import { electronStylish } from '@/styles/electron';

import stylesModule from './WinControl.module.css';

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

export const WINDOW_CONTROL_WIDTH = 112;
const styles = stylesModule;

const WinControl = memo(() => {
  const { t } = useTranslation('electron');
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const syncWindowState = async () => {
      const nextState = await electronSystemService.isWindowMaximized();
      if (mounted) setIsMaximized(nextState);
    };

    void syncWindowState();

    return () => {
      mounted = false;
    };
  }, []);

  const controls = useMemo(
    () => [
      {
        icon: MinusIcon,
        key: 'minimize',
        label: t('window.minimize'),
        onClick: () => void electronSystemService.minimizeWindow(),
      },
      {
        icon: isMaximized ? Minimize2Icon : Maximize2Icon,
        key: 'maximize',
        label: t(isMaximized ? 'window.restore' : 'window.maximize'),
        onClick: async () => {
          await electronSystemService.maximizeWindow();
          setIsMaximized(await electronSystemService.isWindowMaximized());
        },
      },
      {
        icon: XIcon,
        key: 'close',
        label: t('window.close'),
        onClick: () => void electronSystemService.closeWindow(),
      },
    ],
    [isMaximized, t],
  );

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.container, electronStylish.nodrag)}
      gap={4}
      justify={'flex-end'}
    >
      {controls.map((control) => (
        <ActionIcon
          className={control.key === 'close' ? styles.closeButton : styles.controlButton}
          icon={control.icon}
          key={control.key}
          size={{ blockSize: 28, size: 14 }}
          title={control.label}
          tooltipProps={{ placement: 'bottom' }}
          onClick={control.onClick}
        />
      ))}
    </Flexbox>
  );
});

export default WinControl;
