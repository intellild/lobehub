import { Block, Flexbox, Tag, Text } from '@lobehub/ui';
import { type ReactNode } from 'react';
import { memo } from 'react';

import CateTag from '../CateTag';
import HashTags from '../HashTags';
import Time from '../Time';
import stylesModule from './TimeLineCard.module.css';

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

const ACTION_CLASSNAME = 'memory-actions';
const styles = stylesModule;

interface TimeLineCardProps {
  actions?: ReactNode;
  capturedAt?: Date | number | string;
  cate?: string | null;
  children?: ReactNode;
  hashTags?: string[] | null;
  onClick?: () => void;
  title?: ReactNode;
  titleAddon?: ReactNode;
}

const TimeLineCard = memo<TimeLineCardProps>(
  ({ title, titleAddon, cate, children, actions, onClick, capturedAt, hashTags }) => {
    return (
      <Block
        clickable
        className={styles.timelineCard}
        gap={12}
        padding={16}
        variant={'borderless'}
        onClick={onClick}
      >
        {(title || titleAddon) && (
          <Flexbox
            horizontal
            align={'center'}
            gap={4}
            width={'100%'}
            wrap={'wrap'}
            style={{
              overflow: 'hidden',
            }}
          >
            {title && typeof title === 'string' ? (
              <Text as={'h2'} fontSize={16} style={{ lineHeight: 1.5, margin: 0 }} weight={500}>
                {title}
              </Text>
            ) : (
              title
            )}
            {!!titleAddon ? <Tag>{titleAddon}</Tag> : titleAddon}
          </Flexbox>
        )}
        {typeof children === 'string' ? (
          <Text as={'p'} color={'var(--ant-color-text-secondary)'} ellipsis={{ rows: 3 }}>
            {children}
          </Text>
        ) : (
          children
        )}
        <HashTags hashTags={hashTags} />
        <Flexbox horizontal align={'center'} gap={8} justify={'space-between'}>
          <Flexbox horizontal align={'center'} gap={8}>
            <CateTag cate={cate} />
            <Time capturedAt={capturedAt} />
          </Flexbox>
          <Flexbox
            horizontal
            align={'center'}
            className={cx(ACTION_CLASSNAME, styles.actions)}
            gap={4}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {actions}
          </Flexbox>
        </Flexbox>
      </Block>
    );
  },
);

export default TimeLineCard;
