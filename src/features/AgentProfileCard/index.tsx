'use client';

import { Avatar, Center, Flexbox, Skeleton, Text, Tooltip } from '@lobehub/ui';
import { memo, type ReactNode } from 'react';

import { DEFAULT_AVATAR } from '@/const/meta';

import styles from './index.module.css';

export interface AgentProfileCardProps {
  avatar?: string | null;
  backgroundColor?: string | null;
  children?: ReactNode;
  description?: string | null;
  headerAction?: ReactNode;
  /** Show inline skeletons for fields that are still loading. */
  loading?: boolean;
  /** When set, avatar + title become clickable and trigger this handler. */
  onHeaderClick?: () => void;
  title: string;
}

const AgentProfileCard = memo<AgentProfileCardProps>(
  ({
    avatar,
    backgroundColor,
    description,
    headerAction,
    loading,
    onHeaderClick,
    title,
    children,
  }) => {
    return (
      <Flexbox className={styles.container}>
        <Center className={styles.banner} style={{ background: 'var(--ant-color-fill-tertiary)' }}>
          <Avatar
            emojiScaleWithBackground
            avatar={avatar || DEFAULT_AVATAR}
            background={backgroundColor ?? undefined}
            className={styles.bannerInner}
            shape={'square'}
            size={400}
          />
        </Center>

        <Flexbox className={styles.header} gap={8}>
          <Avatar
            emojiScaleWithBackground
            avatar={avatar || DEFAULT_AVATAR}
            background={backgroundColor ?? undefined}
            className={onHeaderClick ? styles.clickableAvatar : undefined}
            shape={'square'}
            size={48}
            style={{ border: `2px solid ${'var(--ant-color-bg-elevated)'}` }}
            onClick={onHeaderClick}
          />
          <Flexbox gap={2}>
            <Flexbox horizontal align={'center'} justify={'space-between'}>
              <Text
                ellipsis
                className={`${styles.name} ${onHeaderClick ? styles.clickableTitle : ''}`}
                onClick={onHeaderClick}
              >
                {title}
              </Text>
              {headerAction}
            </Flexbox>
            {description ? (
              <Tooltip title={description}>
                <Text className={styles.description} ellipsis={{ rows: 2 }}>
                  {description}
                </Text>
              </Tooltip>
            ) : loading ? (
              <Skeleton
                active
                className={styles.descriptionSkeleton}
                paragraph={{ rows: 2, width: ['100%', '60%'] }}
                title={false}
              />
            ) : null}
          </Flexbox>
        </Flexbox>

        {children}
      </Flexbox>
    );
  },
);

export default AgentProfileCard;
