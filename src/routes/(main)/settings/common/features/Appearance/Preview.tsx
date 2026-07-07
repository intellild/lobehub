import { Block, Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import styles from './Preview.module.css';

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

const AgentItem = memo<{
  active?: boolean;
  color?: string;
}>(({ active, color }) => {
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.agent, active && styles.agentActive)}
      gap={4}
      width={'100%'}
    >
      <Flexbox
        className={styles.icon}
        height={12}
        style={{ background: color, borderRadius: '50%' }}
        width={12}
      />
      <Flexbox flex={1} gap={4}>
        <Flexbox
          className={styles.icon}
          height={2}
          width={'66%'}
          style={{
            background: 'var(--ant-color-text-tertiary)',
          }}
        />
        <Flexbox
          className={styles.icon}
          height={2}
          width={'100%'}
          style={{
            background: 'var(--ant-color-text-quaternary)',
          }}
        />
      </Flexbox>
    </Flexbox>
  );
});

const Preview = memo(() => {
  const nav = (
    <Flexbox align={'center'} className={styles.nav} gap={8} width={24}>
      <Flexbox
        className={styles.icon}
        height={14}
        style={{ border: `2px solid ${'var(--ant-color-primary)'}`, borderRadius: '50%' }}
        width={14}
      />
      <Flexbox className={styles.icon} height={12} width={12} />
      <Flexbox className={styles.icon} height={12} width={12} />
      <Flexbox className={styles.icon} height={12} width={12} />
    </Flexbox>
  );

  const sidebar = (
    <Flexbox className={styles.sidebar} gap={4} width={72}>
      <Flexbox
        gap={4}
        paddingInline={2}
        style={{
          paddingTop: 4,
        }}
      >
        <Flexbox className={styles.icon} height={8} width={'50%'} />
        <Flexbox
          className={styles.icon}
          height={8}
          width={'100%'}
          style={{
            background: 'var(--ant-color-fill-tertiary)',
          }}
        />
      </Flexbox>
      <AgentItem />
      <AgentItem active />
      <AgentItem />
      <AgentItem />
    </Flexbox>
  );

  const header = (
    <Flexbox
      horizontal
      align={'center'}
      className={styles.header}
      justify={'space-between'}
      padding={4}
    >
      <Flexbox horizontal align={'center'} gap={4}>
        <Flexbox className={styles.icon} height={12} style={{ borderRadius: '50%' }} width={12} />
        <Flexbox className={styles.icon} height={8} width={32} />
      </Flexbox>
      <Flexbox horizontal gap={2}>
        <Flexbox className={styles.icon} height={10} width={10} />
        <Flexbox className={styles.icon} height={10} width={10} />
      </Flexbox>
    </Flexbox>
  );

  const input = (
    <Flexbox
      align={'flex-end'}
      className={styles.input}
      height={48}
      justify={'flex-end'}
      padding={8}
    >
      <Flexbox
        className={styles.icon}
        height={12}
        width={32}
        style={{
          background: 'var(--ant-color-primary)',
        }}
      />
    </Flexbox>
  );

  return (
    <Block horizontal shadow className={styles.container} variant={'outlined'}>
      {nav}
      {sidebar}
      <Flexbox className={styles.conversation} flex={1}>
        {header}
        <Flexbox align={'flex-start'} flex={1} gap={8} padding={6}>
          <Flexbox horizontal align={'center'} gap={4} justify={'flex-end'} width={'100%'}>
            <Flexbox className={styles.bubble} gap={4} width={64}>
              <Flexbox
                className={styles.icon}
                height={2}
                width={'100%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'66%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
            </Flexbox>
            <Flexbox
              className={styles.icon}
              height={14}
              style={{ borderRadius: '50%' }}
              width={14}
            />
          </Flexbox>
          <Flexbox horizontal gap={4}>
            <Flexbox
              className={styles.icon}
              height={14}
              style={{ borderRadius: '50%' }}
              width={14}
            />
            <Flexbox className={styles.bubble} gap={4} width={160}>
              <Flexbox
                className={styles.icon}
                height={2}
                width={'100%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'66%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'100%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'100%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'33%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
            </Flexbox>
          </Flexbox>
          <Flexbox horizontal align={'center'} gap={4} justify={'flex-end'} width={'100%'}>
            <Flexbox className={styles.bubble} gap={4} width={100}>
              <Flexbox
                className={styles.icon}
                height={2}
                width={'100%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
              <Flexbox
                className={styles.icon}
                height={2}
                width={'66%'}
                style={{
                  background: 'var(--ant-color-text-quaternary)',
                }}
              />
            </Flexbox>
            <Flexbox
              className={styles.icon}
              height={14}
              style={{ borderRadius: '50%' }}
              width={14}
            />
          </Flexbox>
        </Flexbox>
        {input}
      </Flexbox>
    </Block>
  );
});

export default Preview;
