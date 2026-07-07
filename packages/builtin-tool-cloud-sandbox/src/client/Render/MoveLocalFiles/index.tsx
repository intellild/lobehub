'use client';

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Flexbox, Text } from '@lobehub/ui';
import { ArrowRight } from 'lucide-react';
import { memo } from 'react';

import type { MoveLocalFilesState } from '../../../types';
import styles from './index.module.css';

interface MoveLocalFilesParams {
  operations: Array<{
    destination: string;
    source: string;
  }>;
}

const MoveLocalFiles = memo<BuiltinRenderProps<MoveLocalFilesParams, MoveLocalFilesState>>(
  ({ pluginState }) => {
    if (!pluginState?.results) {
      return null;
    }

    const allSuccess = pluginState.successCount === pluginState.totalCount;

    return (
      <Flexbox className={styles.container} gap={8}>
        {/* Header */}
        <Flexbox horizontal align={'center'} gap={8}>
          {allSuccess ? (
            <CheckCircleFilled
              className={styles.statusIcon}
              style={{ color: 'var(--ant-color-success)' }}
            />
          ) : (
            <CloseCircleFilled className={styles.statusIcon} style={{ color: 'var(--ant-color-error)' }} />
          )}
          <Text className={styles.header}>
            Moved {pluginState.successCount}/{pluginState.totalCount} items
          </Text>
        </Flexbox>

        {/* Move operations list */}
        <Block padding={8} style={{ maxHeight: 300, overflow: 'auto' }} variant={'outlined'}>
          <Flexbox gap={4}>
            {pluginState.results.map((result, index) => (
              <Flexbox
                horizontal
                align={'center'}
                className={styles.moveItem}
                gap={8}
                key={index}
                style={{
                  background: result.success ? 'var(--ant-color-success-bg)' : 'var(--ant-color-error-bg)',
                }}
              >
                {result.success ? (
                  <CheckCircleFilled style={{ color: 'var(--ant-color-success)', fontSize: 12 }} />
                ) : (
                  <CloseCircleFilled style={{ color: 'var(--ant-color-error)', fontSize: 12 }} />
                )}
                <Text code ellipsis as={'span'} fontSize={11} style={{ maxWidth: 200 }}>
                  {result.source}
                </Text>
                <ArrowRight className={styles.arrow} size={12} />
                <Text code ellipsis as={'span'} fontSize={11} style={{ maxWidth: 200 }}>
                  {result.destination}
                </Text>
                {result.error && (
                  <Text code as={'span'} fontSize={11} type={'danger'}>
                    ({result.error})
                  </Text>
                )}
              </Flexbox>
            ))}
          </Flexbox>
        </Block>
      </Flexbox>
    );
  },
);

MoveLocalFiles.displayName = 'MoveLocalFiles';

export default MoveLocalFiles;
