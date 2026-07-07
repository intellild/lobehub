'use client';

import { Flexbox, Form, Highlighter } from '@lobehub/ui';
import { Switch } from 'antd';
import { snakeCase } from 'es-toolkit/compat';
import { ListRestartIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { DEFAULT_FEATURE_FLAGS } from '@/config/featureFlags';

import Header from '../features/Header';
import stylesModule from './Form.module.css';

const prefixCls = 'ant';
const styles = stylesModule;

const FeatureFlagForm = memo<{ flags: any }>(({ flags }) => {
  const [data, setData] = useState(flags);
  const [form] = Form.useForm();

  const output = useMemo(
    () =>
      Object.entries(data).map(([key, value]) => {
        const flag = snakeCase(key);
        // @ts-ignore
        if (DEFAULT_FEATURE_FLAGS[flag] === value) return false;
        if (value === true) return `+${flag}`;
        return `-${flag}`;
      }),
    [data],
  );

  return (
    <>
      <Header
        title={'Feature Flag Env'}
        actions={[
          {
            icon: ListRestartIcon,
            onClick: () => {
              form.resetFields();
              setData(flags);
            },
            title: 'Reset',
          },
        ]}
      />
      <Flexbox
        className={styles.container}
        height={'100%'}
        paddingInline={16}
        style={{ overflow: 'auto', position: 'relative' }}
        width={'100%'}
      >
        <Form
          form={form}
          initialValues={flags}
          itemMinWidth={'max(75%,240px)'}
          itemsType={'flat'}
          variant={'borderless'}
          items={Object.keys(flags).map((key) => {
            return {
              children: <Switch size={'small'} />,
              label: snakeCase(key),
              minWidth: undefined,
              name: key,
              valuePropName: 'checked',
            };
          })}
          onValuesChange={(_, v) => setData(v)}
        />
      </Flexbox>
      <Highlighter
        wrap
        language={'env'}
        style={{ flex: 'none', fontSize: 12 }}
      >{`FEATURE_FLAGS="${output.filter(Boolean).join(',')}"`}</Highlighter>
    </>
  );
});

export default FeatureFlagForm;
