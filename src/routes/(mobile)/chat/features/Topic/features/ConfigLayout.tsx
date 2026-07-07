'use client';

import { ActionIcon, Flexbox } from '@lobehub/ui';
import { ChevronRight } from 'lucide-react';
import { type CSSProperties, type ReactNode } from 'react';
import { memo } from 'react';

import SidebarHeader from '@/components/SidebarHeader';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

import styles from './ConfigLayout.module.css';

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

export { styles };

export interface ConfigLayoutProps {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  containerStyle?: CSSProperties;
  expandedHeight?: number | string;
  headerStyle?: CSSProperties;
  onHeaderClick?: () => void;
  sessionId: string;
  title: ReactNode;
}

const ConfigLayout = memo<ConfigLayoutProps>(
  ({
    title,
    actions,
    sessionId,
    className,
    headerStyle,
    containerStyle,
    expandedHeight,
    onHeaderClick,
    children,
  }) => {
    const [expanded, toggleAgentSystemRoleExpand] = useGlobalStore((s) => [
      systemStatusSelectors.getAgentSystemRoleExpanded(sessionId)(s),
      s.toggleAgentSystemRoleExpand,
    ]);

    const handleHeaderClick = () => {
      toggleAgentSystemRoleExpand(sessionId);
      onHeaderClick?.();
    };

    const computedStyle: CSSProperties = expanded
      ? {
          minHeight: 232,
          opacity: 1,
          ...(expandedHeight !== undefined ? { maxHeight: expandedHeight } : {}),
        }
      : {
          minHeight: 0,
          opacity: 0,
          ...(expandedHeight !== undefined ? { maxHeight: 0 } : {}),
        };

    const combinedActions = (
      <Flexbox horizontal align="center" gap={2}>
        {actions}
        <ActionIcon
          className={cx(styles.chevron, expanded && styles.chevronExpanded)}
          icon={ChevronRight}
          size="small"
          style={{
            pointerEvents: 'none',
          }}
          onClick={handleHeaderClick}
        />
      </Flexbox>
    );

    return (
      <Flexbox className={className} height={'fit-content'}>
        <SidebarHeader
          actions={combinedActions}
          title={title}
          style={{
            cursor: 'pointer',
            ...headerStyle,
          }}
          onClick={handleHeaderClick}
        />
        <Flexbox
          className={styles.container}
          style={{
            ...computedStyle,
            ...containerStyle,
          }}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

ConfigLayout.displayName = 'ConfigLayout';

export default ConfigLayout;
