import { type TableProps } from 'antd';
import { ConfigProvider, Table } from 'antd';
import { memo } from 'react';

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

const InlineTable = memo<TableProps & { hoverToActive?: boolean }>(
  ({ hoverToActive, className, ...rest }) => {
    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: 'var(--ant-color-fill-quaternary)',
              headerBorderRadius: 0,
            },
          },
        }}
      >
        <Table
          bordered={false}
          className={cx(styles.table, hoverToActive && styles.hoverToActive, className)}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size={'small'}
          {...rest}
        />
      </ConfigProvider>
    );
  },
);

export default InlineTable;
