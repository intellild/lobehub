import { type ListItemProps } from '@lobehub/ui';
import { Avatar, List } from '@lobehub/ui';
import { useHover } from 'ahooks';
import { memo, useMemo, useRef } from 'react';

import GroupAvatar from '@/features/GroupAvatar';
import { useServerConfigStore } from '@/store/serverConfig';

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

const { Item } = List;

const ListItem = memo<
  ListItemProps & {
    avatar: string | { avatar: string; background?: string }[];
    avatarBackground?: string;
    type?: 'agent' | 'group' | 'inbox';
  }
>(({ avatar, avatarBackground, active, showAction, actions, title, type, ...props }) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const mobile = useServerConfigStore((s) => s.isMobile);

  const avatarRender = useMemo(() => {
    if (type === 'group') {
      const avatars = Array.isArray(avatar) ? avatar : [avatar];
      return <GroupAvatar avatars={avatars} size={40} />;
    }

    // For regular sessions, use the regular Avatar component
    return (
      <Avatar animation={isHovering} avatar={avatar} background={avatarBackground} size={40} />
    );
  }, [isHovering, avatar, avatarBackground, type]);

  return (
    <Item
      actions={actions}
      active={mobile ? false : active}
      avatar={avatarRender}
      className={cx(styles.container, mobile && styles.mobile)}
      ref={ref}
      showAction={actions && (isHovering || showAction || mobile)}
      title={<span className={styles.title}>{title}</span>}
      {...(props as any)}
    />
  );
});

export default ListItem;
