'use client';

import { Flexbox } from '@lobehub/ui';
import { Tabs } from '@lobehub/ui/base-ui';
import { memo, useState } from 'react';

import Header from '../features/Header';
import stylesModule from './index.module.css';
import Ld from './Ld';
import MetaData from './MetaData';
import Og from './Og';

const prefixCls = 'ant';
const styles = stylesModule;

enum Tab {
  Ld = 'ld',
  Meta = 'meta',
  Og = 'og',
}

const MetadataViewer = memo(() => {
  const [active, setActive] = useState<Tab>(Tab.Og);
  return (
    <Flexbox
      className={styles.container}
      height={'100%'}
      style={{ overflow: 'hidden', position: 'relative' }}
      width={'100%'}
    >
      <Header
        style={{ paddingInlineStart: 0 }}
        title={
          <Tabs
            activeKey={active}
            style={{ margin: 16 }}
            items={[
              {
                key: Tab.Og,
                label: 'OG',
              },
              {
                key: Tab.Meta,
                label: 'MetaData',
              },
              {
                key: Tab.Ld,
                label: 'StructuredData',
              },
            ]}
            onChange={(v) => setActive(v as Tab)}
          />
        }
      />
      <Flexbox
        flex={1}
        height={'100%'}
        paddingInline={16}
        style={{ overflow: 'auto', paddingBottom: 16, position: 'relative' }}
        width={'100%'}
      >
        {active === Tab.Og && <Og />}
        {active === Tab.Meta && <MetaData />}
        {active === Tab.Ld && <Ld />}
      </Flexbox>
    </Flexbox>
  );
});

export default MetadataViewer;
