'use client';

import { BRANDING_NAME } from '@lobechat/business-const';
import { ActionIcon, Flexbox, FluentEmoji, SideNav } from '@lobehub/ui';
import { XIcon } from 'lucide-react';
import { memo, type ReactNode, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';

import { isDesktop } from '@/const/version';
import { usePathname } from '@/libs/next/navigation';

import styles from './FloatPanel.module.css';

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

const minWidth = 800;
const minHeight = 600;

interface CollapsibleFloatPanelProps {
  items: { children: ReactNode; icon: ReactNode; key: string }[];
}

const CollapsibleFloatPanel = memo<CollapsibleFloatPanelProps>(({ items }) => {
  const [tab, setTab] = useState<string>(items[0].key);

  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ height: minHeight, width: minWidth });

  const pathname = usePathname();
  useEffect(() => {
    try {
      const localStoragePosition = localStorage.getItem('debug-panel-position');
      if (localStoragePosition && JSON.parse(localStoragePosition)) {
        setPosition(JSON.parse(localStoragePosition));
      }
    } catch {
      /* empty */
    }

    try {
      const localStorageSize = localStorage.getItem('debug-panel-size');
      if (localStorageSize && JSON.parse(localStorageSize)) {
        setSize(JSON.parse(localStorageSize));
      }
    } catch {
      /* empty */
    }
  }, []);

  return (
    <>
      {
        // Hide under desktop devtools
        pathname !== '/desktop/devtools' && isDesktop && (
          <div
            className={styles.debugButton}
            onClick={async () => {
              if (isDesktop) {
                const { electronDevtoolsService } = await import('@/services/electron/devtools');

                await electronDevtoolsService.openDevtools();

                return;
              }
              setIsExpanded(!isExpanded);
            }}
          >
            DEV
          </div>
        )
      }
      {isExpanded && (
        <Rnd
          bounds="window"
          className={cx(styles.panel, isExpanded ? styles.expanded : styles.collapsed)}
          dragHandleClassName="panel-drag-handle"
          minHeight={minHeight}
          minWidth={minWidth}
          position={position}
          size={size}
          onDragStop={(e, d) => {
            setPosition({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setSize({
              height: Number(ref.style.height),
              width: Number(ref.style.width),
            });
            setPosition(position);
          }}
        >
          <Flexbox
            horizontal
            height={'100%'}
            style={{ overflow: 'hidden', position: 'relative' }}
            width={'100%'}
          >
            <SideNav
              avatar={<FluentEmoji emoji={'🧰'} size={24} />}
              bottomActions={[]}
              style={{
                paddingBlock: 12,
                width: 48,
              }}
              topActions={items.map((item) => (
                <ActionIcon
                  active={tab === item.key}
                  icon={item.icon}
                  key={item.key}
                  title={item.key}
                  tooltipProps={{
                    placement: 'right',
                  }}
                  onClick={() => setTab(item.key)}
                />
              ))}
            />
            <Flexbox
              height={'100%'}
              style={{ overflow: 'hidden', position: 'relative' }}
              width={'100%'}
            >
              <Flexbox
                horizontal
                align={'center'}
                className={cx('panel-drag-handle', styles.header)}
                justify={'space-between'}
              >
                <Flexbox horizontal align={'baseline'} gap={6}>
                  <b>{BRANDING_NAME} Dev Tools</b>
                  <span style={{ color: 'var(--ant-color-text-description)' }}>/</span>
                  <span style={{ color: 'var(--ant-color-text-description)' }}>{tab}</span>
                </Flexbox>
                <ActionIcon icon={XIcon} onClick={() => setIsExpanded(false)} />
              </Flexbox>
              {items.map((item) => (
                <Flexbox
                  flex={1}
                  height={'100%'}
                  key={item.key}
                  style={{
                    display: tab === item.key ? 'flex' : 'none',
                    overflow: 'hidden',
                  }}
                >
                  {item.children}
                </Flexbox>
              ))}
            </Flexbox>
          </Flexbox>
        </Rnd>
      )}
    </>
  );
});

export default CollapsibleFloatPanel;
