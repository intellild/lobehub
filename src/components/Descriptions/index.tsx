import { type GridProps, type IconProps } from '@lobehub/ui';
import { Flexbox, Grid, Icon, Text } from '@lobehub/ui';
import { type CSSProperties, type ReactNode } from 'react';
import { memo } from 'react';

import CopyableLabel from '../CopyableLabel';
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

export interface DescriptionItem {
  className?: string;
  classNames?: {
    label?: string;
    value?: string;
  };
  copyable?: boolean;
  icon?: IconProps['icon'];
  key: string;
  label: ReactNode;
  style?: CSSProperties;
  styles?: {
    label?: CSSProperties;
    value?: CSSProperties;
  };
  value: ReactNode;
}

interface DescriptionsProps extends Omit<GridProps, 'children' | 'wrap'> {
  bordered?: boolean;
  classNames?: {
    item?: string;
    label?: string;
    value?: string;
  };
  items: DescriptionItem[];
  labelWidth?: number | string;
  styles?: {
    item?: CSSProperties;
    label?: CSSProperties;
    value?: CSSProperties;
  };
  wrap?: boolean;
}

const Descriptions = memo<DescriptionsProps>(
  ({
    labelWidth = 150,
    title,
    bordered,
    className,
    items,
    classNames,
    styles: customStyles,
    wrap,
    ...rest
  }) => {
    return (
      <>
        {title && <h3 style={{ marginTop: 12 }}>{title}</h3>}
        <Grid
          className={cx(bordered && styles.bordered, className)}
          gap={0}
          maxItemWidth={450}
          {...rest}
        >
          {items.map((item) => (
            <Flexbox
              horizontal
              align={wrap ? 'flex-start' : 'center'}
              className={cx(bordered && styles.cell, item.className, classNames?.item)}
              flex={1}
              key={item.key}
              style={{
                overflow: wrap ? undefined : 'hidden',
                position: 'relative',
                ...customStyles?.item,
                ...item.style,
              }}
            >
              <Flexbox
                horizontal
                align={'center'}
                className={cx(bordered && styles.label)}
                flex={'none'}
                gap={6}
                paddingBlock={bordered ? 12 : 4}
                paddingInline={bordered ? 16 : 0}
                style={{ height: '100%', position: 'relative' }}
                width={labelWidth}
              >
                {item.icon && <Icon color={'var(--ant-color-text-secondary)'} icon={item.icon} />}
                <Text
                  ellipsis
                  className={cx(classNames?.label, item.classNames?.label)}
                  style={{
                    color: 'var(--ant-color-text-secondary)',
                    ...customStyles?.label,
                    ...item.styles?.label,
                  }}
                >
                  {item.label}
                </Text>
              </Flexbox>
              <Flexbox
                horizontal
                align={wrap ? 'flex-start' : 'center'}
                flex={1}
                justify={'flex-start'}
                paddingBlock={bordered ? 12 : 4}
                paddingInline={16}
                style={{
                  height: '100%',
                  overflow: wrap ? undefined : 'hidden',
                  position: 'relative',
                }}
              >
                {item.copyable ? (
                  <CopyableLabel
                    className={cx(classNames?.value, item.classNames?.value)}
                    style={{ ...customStyles?.value, ...item.styles?.value }}
                    value={item.value ? String(item.value) : '--'}
                    wrap={wrap}
                  />
                ) : (
                  <Text
                    className={cx(classNames?.value, item.classNames?.value)}
                    ellipsis={!wrap}
                    style={{
                      ...(wrap && {
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }),
                      ...customStyles?.value,
                      ...item.styles?.value,
                    }}
                  >
                    {item.value}
                  </Text>
                )}
              </Flexbox>
            </Flexbox>
          ))}
        </Grid>
      </>
    );
  },
);

export default Descriptions;
