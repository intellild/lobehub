'use client';

import { TITLE_BAR_HEIGHT } from '@lobechat/desktop-bridge';
import { Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useWatchThemeUpdate } from '@/features/Electron/system/useWatchThemeUpdate';
import { WINDOWS_NATIVE_CONTROL_WIDTH } from '@/features/Electron/titlebar/layout';
import WinControl from '@/features/Electron/titlebar/WinControl';
import { electronStylish } from '@/styles/electron';
import { getPlatform, isMacOS } from '@/utils/platform';

import PinOnTopButton from './PinOnTopButton';
import styles from './TitleBar.module.css';

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

// Reserve space for macOS traffic lights when titleBarStyle is hidden.
const MAC_TRAFFIC_LIGHT_WIDTH = 80;

interface PopupTitleBarProps {
  title?: string;
}

const PopupTitleBar = memo<PopupTitleBarProps>(({ title }) => {
  useWatchThemeUpdate();

  const platform = getPlatform();
  const isMac = isMacOS();
  const isLinux = platform === 'Linux';
  const isWindows = platform === 'Windows';
  const showWinControl = !isMac && isLinux;
  const leftSpacer = isMac ? MAC_TRAFFIC_LIGHT_WIDTH : 0;
  const rightSpacer = isWindows ? WINDOWS_NATIVE_CONTROL_WIDTH : 0;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.container, electronStylish.draggable)}
      flex={'none'}
      gap={4}
      height={TITLE_BAR_HEIGHT}
      style={{ minHeight: TITLE_BAR_HEIGHT, paddingInline: 8 }}
      width={'100%'}
    >
      <div style={{ flex: `0 0 ${leftSpacer}px` }} />
      <Flexbox flex={1} style={{ minWidth: 0 }}>
        {title && <div className={styles.title}>{title}</div>}
      </Flexbox>
      <PinOnTopButton />
      {showWinControl ? <WinControl /> : <div style={{ flex: `0 0 ${rightSpacer}px` }} />}
    </Flexbox>
  );
});

PopupTitleBar.displayName = 'PopupTitleBar';

export default PopupTitleBar;
