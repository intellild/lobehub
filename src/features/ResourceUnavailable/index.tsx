'use client';

import { Flexbox, Icon } from '@lobehub/ui';
import { EyeOffIcon } from 'lucide-react';
import { type CSSProperties, memo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';

export type ResourceUnavailableVariant = 'card' | 'inline' | 'attachment';

export interface ResourceUnavailableProps {
  className?: string;
  size?: 'small' | 'default';
  style?: CSSProperties;
  /**
   * Rendering shell. `inline` — pill-sized replacement for a text mention;
   * `attachment` — chat message file-card slot; `card` — larger placeholder
   * for detail-page mounts (agent editor's KB list, topic sidebar link).
   *
   * The message copy stays the same across all three — the surrounding
   * context (an attachment slot, a KB tile, a linked-doc chip) already tells
   * the viewer what kind of thing went missing, so we don't repeat it.
   */
  variant?: ResourceUnavailableVariant;
}

/**
 * `ResourceUnavailable`
 *
 * Uniform placeholder rendered wherever a cross-user reference resolves to a
 * resource the current viewer no longer has access to — typically because the
 * creator flipped it back to `private` via `setVisibility`. Kept
 * intentionally low-emphasis so message threads don't scream at readers who
 * didn't do anything wrong.
 */
const ResourceUnavailable = memo<ResourceUnavailableProps>(
  ({ variant = 'inline', size = 'default', className, style }) => {
    const { t } = useTranslation('common');

    const iconSize = size === 'small' || variant === 'inline' ? 12 : 16;
    const shellClass = styles[variant];
    const sizeClass = size === 'small' && variant !== 'inline' ? styles.small : '';
    const mergedClass = [shellClass, sizeClass, className].filter(Boolean).join(' ');

    return (
      <Flexbox
        align="center"
        className={mergedClass}
        direction="horizontal"
        gap={variant === 'inline' ? 4 : 8}
        style={style}
      >
        <Icon className={styles.icon} icon={EyeOffIcon} size={iconSize} />
        <span>{t('resourceUnavailable')}</span>
      </Flexbox>
    );
  },
);

ResourceUnavailable.displayName = 'ResourceUnavailable';

export default ResourceUnavailable;
