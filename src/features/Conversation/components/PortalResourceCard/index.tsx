'use client';

import { Center, Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import { FileText } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { memo } from 'react';

import styles from './index.module.css';

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

export interface PortalResourceCardProps {
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  onOpen?: () => void;
  onSecondaryAction?: () => void;
  openLabel?: ReactNode;
  secondaryAction?: ReactNode;
  secondaryActionLabel?: ReactNode;
  title: ReactNode;
  tooltip?: ReactNode;
}

const PortalResourceCard = memo<PortalResourceCardProps>(
  ({
    className,
    description,
    icon,
    openLabel,
    secondaryAction,
    secondaryActionLabel,
    title,
    tooltip,
    onOpen,
    onSecondaryAction,
  }) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!onOpen) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      onOpen();
    };
    const handleSecondaryActionClick = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onSecondaryAction?.();
    };

    // Mirrors the inline artifact card shell, while keeping portal-open behavior owned by callers.
    const card = (
      <Flexbox horizontal align={'center'} className={cx(styles.container, className)}>
        <Flexbox
          horizontal
          align={'center'}
          className={cx(styles.trigger, onOpen && styles.actionable)}
          flex={1}
          role={onOpen ? 'button' : undefined}
          tabIndex={onOpen ? 0 : undefined}
          onClick={onOpen}
          onKeyDown={onOpen ? handleKeyDown : undefined}
        >
          <Center horizontal className={styles.avatar} width={64}>
            {icon ?? <Icon icon={FileText} size={28} />}
          </Center>
          <Flexbox className={styles.content} flex={1} gap={4} paddingInline={12}>
            <Text ellipsis className={styles.title}>
              {title}
            </Text>
            {description && (
              <Text ellipsis className={styles.desc}>
                {description}
              </Text>
            )}
          </Flexbox>
          {onOpen && openLabel && (
            <Flexbox flex={'none'} style={{ paddingInlineEnd: 10 }}>
              <div aria-hidden className={styles.openLabel}>
                {openLabel}
              </div>
            </Flexbox>
          )}
        </Flexbox>
        {(secondaryAction || secondaryActionLabel) && (
          <Flexbox flex={'none'} style={{ paddingInlineEnd: 10 }}>
            {secondaryAction ?? (
              <>
                {onSecondaryAction ? (
                  <button
                    className={styles.actionButton}
                    type={'button'}
                    onClick={handleSecondaryActionClick}
                  >
                    {secondaryActionLabel}
                  </button>
                ) : (
                  <div aria-hidden className={styles.openLabel}>
                    {secondaryActionLabel}
                  </div>
                )}
              </>
            )}
          </Flexbox>
        )}
      </Flexbox>
    );

    return tooltip ? (
      <Tooltip placement={'topLeft'} title={tooltip}>
        {card}
      </Tooltip>
    ) : (
      card
    );
  },
);

PortalResourceCard.displayName = 'PortalResourceCard';

export default PortalResourceCard;
