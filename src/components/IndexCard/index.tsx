import { type FlexboxProps } from '@lobehub/ui';
import { ActionIcon, Center, Flexbox } from '@lobehub/ui';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { type ReactNode } from 'react';
import { memo } from 'react';

import styles from './index.module.css';

interface IndexCardProps extends Omit<FlexboxProps, 'title'> {
  desc?: ReactNode;
  expand?: boolean;
  extra?: ReactNode;
  icon?: ReactNode;
  moreTooltip?: string;
  onExpand?: () => void;
  onMoreClick?: () => void;
  title?: ReactNode;
}

const IndexCard = memo<IndexCardProps>(
  ({
    expand = true,
    onExpand,
    icon,
    className,
    onMoreClick,
    title,
    extra,
    moreTooltip,
    desc,
    children,
    ...rest
  }) => {
    return (
      <Flexbox
        style={{
          marginBottom: !expand ? 12 : undefined,
          maxWidth: '1024px',
          position: 'relative',
          width: '100%',
        }}
      >
        <Flexbox
          className={styles.card}
          style={{
            paddingBottom: !expand ? 12 : undefined,
          }}
        >
          {title && (
            <Flexbox
              horizontal
              align={'center'}
              className={styles.header}
              gap={16}
              justify={'space-between'}
              padding={16}
            >
              <Flexbox horizontal align={'center'} gap={12}>
                {icon}
                <Flexbox>
                  <div className={styles.title}>{title}</div>
                  {desc && <div className={styles.desc}>{desc}</div>}
                </Flexbox>
              </Flexbox>
              <Flexbox horizontal align={'center'} gap={8}>
                {extra}
                {onMoreClick && (
                  <ActionIcon
                    className={styles.more}
                    icon={ChevronRight}
                    size={{ blockSize: 32, borderRadius: '50%', size: 16 }}
                    title={moreTooltip}
                    onClick={onMoreClick}
                  />
                )}
              </Flexbox>
            </Flexbox>
          )}
          <Flexbox className={className} gap={16} padding={16} width={'100%'} {...rest}>
            {children}
          </Flexbox>
        </Flexbox>
        {!expand && (
          <Center className={styles.expend} height={24} width={24}>
            <ActionIcon
              icon={ChevronDown}
              size={{ blockSize: 24, borderRadius: '50%', size: 16 }}
              onClick={onExpand}
            />
          </Center>
        )}
      </Flexbox>
    );
  },
);

IndexCard.displayName = 'IndexCard';

export default IndexCard;
