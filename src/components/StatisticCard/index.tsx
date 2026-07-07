import { type StatisticCardProps as AntdStatisticCardProps } from '@ant-design/pro-components';
import { StatisticCard as AntdStatisticCard } from '@ant-design/pro-components';
import { type BlockProps } from '@lobehub/ui';
import { Block, Text } from '@lobehub/ui';
import { Spin } from 'antd';
import { memo } from 'react';

import { useResponsive } from '@/hooks/useResponsive';

import stylesModule from './index.module.css';

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

const prefixCls = 'ant';
const styles = stylesModule;

interface StatisticCardProps
  extends
    AntdStatisticCardProps,
    Pick<BlockProps, 'variant' | 'padding' | 'paddingBlock' | 'paddingInline'> {}

const StatisticCard = memo<StatisticCardProps>(
  ({
    title,
    className,

    variant = 'borderless',
    loading,
    extra,
    style,
    padding,
    paddingBlock,
    paddingInline,
    ...rest
  }) => {
    const { mobile } = useResponsive();

    return (
      <Block
        className={className}
        flex={1}
        padding={padding}
        paddingBlock={paddingBlock}
        paddingInline={paddingInline}
        style={style}
        variant={variant}
      >
        <AntdStatisticCard
          bordered={!mobile}
          className={cx(styles.container, styles.raw)}
          extra={loading ? <Spin percent={'auto'} size={'small'} /> : extra}
          title={
            typeof title === 'string' ? (
              <Text
                as={'h2'}
                ellipsis={{ rows: 1, tooltip: true }}
                style={{
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  lineHeight: 'inherit',
                  margin: 0,
                  overflow: 'hidden',
                }}
              >
                {title}
              </Text>
            ) : (
              title
            )
          }
          {...rest}
        />
      </Block>
    );
  },
);

export default StatisticCard;
