'use client';

import { type FlexboxProps } from '@lobehub/ui';
import { Button, Flexbox, Icon, Tag } from '@lobehub/ui';
import { ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import WorkspaceLink from '@/features/Workspace/WorkspaceLink';
import { useResponsive } from '@/hooks/useResponsive';

import { SCROLL_PARENT_ID } from '../features/const';
import styles from './Title.module.css';

const SCROLL_CONTAINER_ID = 'lobe-mobile-scroll-container';

interface TitleProps extends FlexboxProps {
  more?: ReactNode;
  moreLink?: string;
  tag?: ReactNode;
}

const Title = memo<TitleProps>(({ tag, children, moreLink, more }) => {
  const { mobile } = useResponsive();
  const title = <h2 className={styles.title}>{children}</h2>;

  const handleMoreClick = () => {
    if (!moreLink) return;

    const scrollContainerId = mobile ? SCROLL_CONTAINER_ID : SCROLL_PARENT_ID;
    const scrollableElement = document?.querySelector(`#${scrollContainerId}`);

    if (!scrollableElement) return;
    scrollableElement.scrollTo({ behavior: 'smooth', top: 0 });
  };

  return (
    <Flexbox horizontal align={'center'} gap={16} justify={'space-between'} width={'100%'}>
      {tag ? (
        <Flexbox horizontal align={'center'} gap={8}>
          {title}
          <Tag className={styles.tag}>{tag}</Tag>
        </Flexbox>
      ) : (
        title
      )}
      {moreLink && (
        <WorkspaceLink
          target={moreLink.startsWith('http') ? '_blank' : undefined}
          to={moreLink}
          onClick={handleMoreClick}
        >
          <Button className={styles.more} style={{ paddingInline: 6 }} type={'text'}>
            <span>{more}</span>
            <Icon icon={ChevronRight} />
          </Button>
        </WorkspaceLink>
      )}
    </Flexbox>
  );
});

export default Title;
