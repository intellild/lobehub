'use client';

import { AGENT_ONBOARDING_ENABLED } from '@lobechat/business-const';
import { isDesktop } from '@lobechat/const';
import { ActionIcon, Flexbox, Text } from '@lobehub/ui';
import { Tabs } from '@lobehub/ui/base-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useServerConfigStore } from '@/store/serverConfig';

import styles from './ModeSwitch.module.css';

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

const COLLAPSED_STORAGE_KEY = 'LOBE_ONBOARDING_MODE_SWITCH_COLLAPSED';

interface ModeSwitchProps {
  actions?: ReactNode;
  className?: string;
  showLabel?: boolean;
  style?: CSSProperties;
}

const ModeSwitch = memo<ModeSwitchProps>(({ actions, className, showLabel = false, style }) => {
  const { t } = useTranslation('onboarding');
  const location = useLocation();
  const navigate = useWorkspaceAwareNavigate();
  const enableAgentOnboarding = useServerConfigStore((s) => s.featureFlags.enableAgentOnboarding);
  const serverConfigInit = useServerConfigStore((s) => s.serverConfigInit);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === '1';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  const mode = useMemo(() => {
    return location.pathname.startsWith('/onboarding/agent') ? 'agent' : 'classic';
  }, [location.pathname]);

  const options = useMemo(() => {
    if (!AGENT_ONBOARDING_ENABLED || isDesktop || !serverConfigInit || !enableAgentOnboarding) {
      return [];
    }

    return [
      { key: 'agent', label: t('agent.modeSwitch.agent') },
      { key: 'classic', label: t('agent.modeSwitch.classic') },
    ];
  }, [enableAgentOnboarding, serverConfigInit, t]);

  const segmented =
    options.length > 0 ? (
      <Tabs
        activeKey={mode}
        items={options}
        size={'small'}
        onChange={(key) => {
          navigate(key === 'agent' ? '/onboarding/agent' : '/onboarding/classic');
        }}
      />
    ) : null;

  if (!segmented && !actions) return null;

  const collapseToggle = (
    <ActionIcon
      icon={collapsed ? ChevronLeft : ChevronRight}
      size={'small'}
      title={collapsed ? t('agent.modeSwitch.expand') : t('agent.modeSwitch.collapse')}
      onClick={() => setCollapsed((v) => !v)}
    />
  );

  return (
    <Flexbox
      className={cx(styles.anchor, showLabel && !collapsed && styles.anchorWithLabel, className)}
      style={style}
    >
      {showLabel && segmented && !collapsed && (
        <Text style={{ paddingInline: 4 }} type={'secondary'}>
          {t('agent.modeSwitch.label')}
        </Text>
      )}
      {actions ? (
        <div className={cx(styles.pill, collapsed && styles.pillCollapsed)}>
          {collapseToggle}
          {!collapsed && (
            <>
              {actions}
              {segmented}
            </>
          )}
        </div>
      ) : (
        segmented
      )}
    </Flexbox>
  );
});

ModeSwitch.displayName = 'OnboardingModeSwitch';

export default ModeSwitch;
