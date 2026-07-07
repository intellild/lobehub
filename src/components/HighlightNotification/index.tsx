'use client';

import { HeartFilled } from '@ant-design/icons';
import { ActionIcon, Button, Flexbox } from '@lobehub/ui';
import { X } from 'lucide-react';
import type { HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { memo } from 'react';

import styles from './index.module.css';

export interface HighlightNotificationProps {
  actionHref?: string;
  actionIcon?: ReactNode;
  actionLabel?: ReactNode;
  actionTarget?: HTMLAttributeAnchorTarget;
  description?: ReactNode;
  image?: string;
  onAction?: () => void;
  onActionClick?: () => void;
  onClose?: () => void;
  open?: boolean;
  title?: ReactNode;
}

const HighlightNotification = memo<HighlightNotificationProps>(
  ({
    actionHref,
    actionIcon = <HeartFilled />,
    actionLabel,
    actionTarget = '_blank',
    description,
    image,
    onAction,
    onActionClick,
    onClose,
    open,
    title,
  }) => {
    if (!open) return null;

    const actionContent = actionLabel ? (
      <span className={styles.actionContent}>
        {actionIcon && <span>{actionIcon}</span>}
        <span>{actionLabel}</span>
      </span>
    ) : null;

    return (
      <Flexbox className={styles.card}>
        <ActionIcon className={styles.closeButton} icon={X} size={14} onClick={onClose} />
        <Flexbox gap={0}>
          {image && <img alt="" className={styles.image} src={image} />}
          <Flexbox gap={4} padding={12}>
            {title && <div className={styles.title}>{title}</div>}
            {description && <div className={styles.description}>{description}</div>}
            {actionLabel && actionHref && (
              <a
                className={styles.action}
                href={actionHref}
                rel="noopener noreferrer"
                target={actionTarget}
                onClick={onActionClick}
              >
                <Button block size="small" type="primary">
                  {actionContent}
                </Button>
              </a>
            )}
            {actionLabel && !actionHref && (
              <Button
                block
                className={styles.action}
                size="small"
                type="primary"
                onClick={onAction}
              >
                {actionContent}
              </Button>
            )}
          </Flexbox>
        </Flexbox>
      </Flexbox>
    );
  },
);

HighlightNotification.displayName = 'HighlightNotification';

export default HighlightNotification;
