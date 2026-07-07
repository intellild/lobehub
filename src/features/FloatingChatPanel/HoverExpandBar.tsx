'use client';

import { Icon } from '@lobehub/ui';
import { ChevronUp } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './HoverExpandBar.module.css';

export interface HoverExpandBarProps {
  bottomOffset?: number;
  onExpand: () => void;
  visible: boolean;
}

const HoverExpandBar = memo<HoverExpandBarProps>(({ bottomOffset = 0, visible, onExpand }) => {
  const { t } = useTranslation('chat');
  const s = styles;

  return (
    <div
      aria-hidden={!visible}
      className={`${s.bar} ${visible ? s.visible : s.hidden}`}
      data-testid="floating-chat-panel-hover-bar"
      style={bottomOffset > 0 ? { insetBlockEnd: `calc(100% + ${bottomOffset}px)` } : undefined}
    >
      <button
        className={s.trigger}
        data-testid="floating-chat-panel-expand-button"
        tabIndex={visible ? 0 : -1}
        type="button"
        onClick={onExpand}
      >
        <Icon icon={ChevronUp} size={12} />
        {t('floatingChatPanel.expand', { defaultValue: 'Expand' })}
      </button>
    </div>
  );
});

HoverExpandBar.displayName = 'FloatingChatPanelHoverExpandBar';

export default HoverExpandBar;
