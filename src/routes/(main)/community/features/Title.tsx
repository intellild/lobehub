'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox, Icon } from '@lobehub/ui';
import { ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import WorkspaceLink from '@/features/Workspace/WorkspaceLink';

import styles from './Title.module.css';

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

export interface TitleProps extends FlexboxProps {
  icon?: ReactNode;
  id?: string;
  level?: 2 | 3;
  more?: ReactNode;
  moreLink?: string;
  tag?: ReactNode;
}

const Title = memo<TitleProps>(
  ({ id, tag, children, moreLink, more, level = 2, icon, ...rest }) => {
    const title = (
      <h2 className={cx(styles.title, styles[`title${level}` as 'title2' | 'title3'])} id={id}>
        {children}
      </h2>
    );

    // Check if it's an external link or internal community route
    const isExternalLink = moreLink?.startsWith('http') ?? false;
    const isCommunityRoute = moreLink?.startsWith('/community') ?? false;

    let moreLinkElement = null;
    if (moreLink) {
      if (isExternalLink) {
        moreLinkElement = (
          <a className={styles.more} href={moreLink} rel="noreferrer" target="_blank">
            <span style={{ marginRight: 4 }}>{more}</span>
            <Icon icon={ChevronRight} />
          </a>
        );
      } else if (isCommunityRoute) {
        moreLinkElement = (
          <WorkspaceLink className={styles.more} to={moreLink}>
            <span style={{ marginRight: 4 }}>{more}</span>
            <Icon icon={ChevronRight} />
          </WorkspaceLink>
        );
      } else {
        moreLinkElement = (
          <WorkspaceLink className={styles.more} to={moreLink}>
            <span style={{ marginRight: 4 }}>{more}</span>
            <Icon icon={ChevronRight} />
          </WorkspaceLink>
        );
      }
    }

    return (
      <Flexbox
        horizontal
        align={'center'}
        gap={16}
        justify={'space-between'}
        width={'100%'}
        {...rest}
      >
        {tag || icon ? (
          <Flexbox horizontal align={'center'} gap={8}>
            {icon}
            {title}
            {tag && (
              <Flexbox horizontal align={'center'} gap={4}>
                {tag}
              </Flexbox>
            )}
          </Flexbox>
        ) : (
          title
        )}
        {moreLinkElement}
      </Flexbox>
    );
  },
);

export default Title;
