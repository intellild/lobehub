import { type FlexboxProps } from '@lobehub/ui';
import { Flexbox, Icon, Text, Tooltip } from '@lobehub/ui';
import { HelpCircleIcon } from 'lucide-react';
import { type CSSProperties, type ReactNode } from 'react';
import { memo } from 'react';

import styles from './Statistic.module.css';

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

export { styles };

export interface StatisticProps extends Omit<FlexboxProps, 'children' | 'title'> {
  title: ReactNode;
  titleStyle?: CSSProperties;
  tooltip?: string;
  value: ReactNode;
  valuePlacement?: 'top' | 'bottom';
  valueStyle?: CSSProperties;
}

const Statistic = memo<StatisticProps>(
  ({
    className,
    valueStyle,
    titleStyle,
    valuePlacement = 'top',
    tooltip,
    title,
    value,
    ...rest
  }) => {
    const isTop = valuePlacement === 'top';
    const valueContent = (
      <Text className={styles.number} ellipsis={{ rows: 1 }} style={valueStyle}>
        {value}
      </Text>
    );
    const titleContent = (
      <Text className={styles.title} ellipsis={{ rows: 1 }} style={titleStyle}>
        {title}
        {tooltip && <Icon icon={HelpCircleIcon} style={{ marginLeft: '0.4em' }} />}
      </Text>
    );
    const content = (
      <Flexbox
        align={'center'}
        className={cx(styles.container, className)}
        flex={1}
        justify={'center'}
        {...rest}
      >
        {isTop ? (
          <>
            {valueContent}
            {titleContent}
          </>
        ) : (
          <>
            {titleContent}
            {valueContent}
          </>
        )}
      </Flexbox>
    );

    if (!tooltip) return content;

    return <Tooltip title={tooltip}>{content}</Tooltip>;
  },
);

export default Statistic;
