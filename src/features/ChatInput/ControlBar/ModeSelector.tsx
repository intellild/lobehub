import { Flexbox, Icon, Popover, Tooltip } from '@lobehub/ui';
import {
  ChevronDownIcon,
  FolderIcon,
  InfinityIcon,
  MessageCircleIcon,
  SearchIcon,
  TerminalIcon,
  WrenchIcon,
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBusinessAgentModeSync } from '@/business/client/hooks/useBusinessAgentMode';
import { useAgentId } from '@/features/ChatInput/hooks/useAgentId';
import { useEffectiveAgentMode } from '@/features/ChatInput/hooks/useEffectiveAgentMode';
import { useToggleAgentMode } from '@/features/ChatInput/hooks/useToggleAgentMode';
import { usePermission } from '@/hooks/usePermission';

import styles from './ModeSelector.module.css';

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

const AGENT_CAPS = [
  { icon: WrenchIcon, key: 'tools' },
  { icon: SearchIcon, key: 'web' },
  { icon: FolderIcon, key: 'files' },
  { icon: TerminalIcon, key: 'env' },
] as const;

const ModeSelector = memo(() => {
  const { t } = useTranslation('chat');
  const agentId = useAgentId();
  const toggleAgentMode = useToggleAgentMode();
  useBusinessAgentModeSync(agentId);
  const [open, setOpen] = useState(false);
  const { allowed: canCreateContent, reason } = usePermission('create_content');

  const { canSelectAgentMode, currentMode, isAgentModeUnavailable } =
    useEffectiveAgentMode(agentId);
  const CurrentIcon = currentMode === 'agent' ? InfinityIcon : MessageCircleIcon;

  const handleSelect = useCallback(
    async (mode: 'chat' | 'agent') => {
      if (!canCreateContent) return;
      if (mode === 'agent' && !canSelectAgentMode) return;

      setOpen(false);
      await toggleAgentMode(mode === 'agent');
    },
    [canCreateContent, canSelectAgentMode, toggleAgentMode],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!canCreateContent) return;

      setOpen(nextOpen);
    },
    [canCreateContent],
  );

  const agentTooltip = (
    <div className={styles.agentTooltip}>
      <div className={styles.agentTooltipTitle}>{t('chatMode.agent')}</div>
      {AGENT_CAPS.map(({ key, icon }) => (
        <div className={styles.agentTooltipCap} key={key}>
          <Icon icon={icon} size={12} />
          {t(`chatMode.agentCap.${key}`)}
        </div>
      ))}
    </div>
  );

  const chatTooltip = t('chatMode.chatDesc');
  const buttonTooltip = isAgentModeUnavailable
    ? t('chatMode.agentUnsupported')
    : currentMode === 'agent'
      ? agentTooltip
      : chatTooltip;
  const agentDesc = canSelectAgentMode ? t('chatMode.agentDesc') : t('chatMode.agentUnsupported');

  const popoverContent = (
    <Flexbox gap={4} style={{ maxWidth: 320, minWidth: 280 }}>
      <Flexbox
        horizontal
        align="center"
        gap={12}
        className={cx(
          styles.option,
          currentMode === 'agent' && styles.activeOption,
          !canSelectAgentMode && styles.optionDisabled,
        )}
        onClick={() => handleSelect('agent')}
      >
        <Flexbox
          align="center"
          className={styles.optionIcon}
          height={32}
          justify="center"
          width={32}
        >
          <Icon icon={InfinityIcon} size={16} />
        </Flexbox>
        <Flexbox flex={1}>
          <div className={styles.optionTitle}>{t('chatMode.agent')}</div>
          <div className={styles.optionDesc}>{agentDesc}</div>
        </Flexbox>
      </Flexbox>

      <Flexbox
        horizontal
        align="center"
        className={cx(styles.option, currentMode === 'chat' && styles.activeOption)}
        gap={12}
        onClick={() => handleSelect('chat')}
      >
        <Flexbox
          align="center"
          className={styles.optionIcon}
          height={32}
          justify="center"
          width={32}
        >
          <Icon icon={MessageCircleIcon} size={16} />
        </Flexbox>
        <Flexbox flex={1}>
          <div className={styles.optionTitle}>{t('chatMode.chat')}</div>
          <div className={styles.optionDesc}>{t('chatMode.chatDesc')}</div>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );

  const button = (
    <div className={cx(styles.button, !canCreateContent && styles.buttonDisabled)}>
      <Icon icon={CurrentIcon} size={14} />
      <span>{t(`chatMode.${currentMode}`)}</span>
      <Icon icon={ChevronDownIcon} size={12} />
    </div>
  );

  if (!canCreateContent)
    return (
      <Tooltip title={reason}>
        <div>{button}</div>
      </Tooltip>
    );

  return (
    <Popover
      className={styles.popoverPopup}
      content={popoverContent}
      open={canCreateContent && open}
      placement="topLeft"
      trigger="click"
      styles={{
        // Match the inner viewport's corner to the enlarged popup radius so its
        // border corners don't poke through the rounded popup.
        content: {
          border: `1px solid ${'var(--ant-color-border-secondary)'}`,
          borderRadius: 'var(--ant-border-radius-lg)',
          padding: 4,
        },
      }}
      onOpenChange={handleOpenChange}
    >
      <div>{open ? button : <Tooltip title={buttonTooltip}>{button}</Tooltip>}</div>
    </Popover>
  );
});

ModeSelector.displayName = 'ModeSelector';

export default ModeSelector;
