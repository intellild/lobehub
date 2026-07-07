'use client';

import type { ModifyNodesArgs, ModifyOperation } from '@lobechat/editor-runtime';
import type { BuiltinRenderProps } from '@lobechat/types';
import { Block, Icon, Text } from '@lobehub/ui';
import { Check, DiffIcon, Minus, Plus, X } from 'lucide-react';
import { memo } from 'react';

import type { ModifyNodesState } from '../../../types';
import styles from './index.module.css';

const actionMeta = {
  insert: { color: 'var(--ant-color-success)', icon: Plus },
  modify: { color: 'var(--ant-color-warning)', icon: DiffIcon },
  remove: { color: 'var(--ant-color-error)', icon: Minus },
} as const;

const getOperationDetails = (op: ModifyOperation) => {
  switch (op.action) {
    case 'insert': {
      const position = 'afterId' in op ? `after #${op.afterId}` : `before #${op.beforeId}`;
      return { content: op.litexml, position };
    }
    case 'modify': {
      const litexml = Array.isArray(op.litexml) ? op.litexml.join('\n') : op.litexml;
      return { content: litexml };
    }
    case 'remove': {
      return { position: `#${op.id}` };
    }
  }
};

export const ModifyNodesRender = memo<BuiltinRenderProps<ModifyNodesArgs, ModifyNodesState>>(
  ({ args, pluginState }) => {
    const operations = args?.operations;
    if (!Array.isArray(operations) || operations.length === 0) return null;

    const results = pluginState?.results ?? [];

    return (
      <Block variant={'outlined'} width={'100%'}>
        {operations.map((op, index) => {
          const meta = actionMeta[op.action];
          const details = getOperationDetails(op);
          const result = results[index];
          const success = result?.success === true;
          const failed = result?.success === false;

          return (
            <div className={styles.row} key={index}>
              <span className={styles.index}>{index + 1}.</span>
              <Icon icon={meta.icon} size={14} style={{ color: meta.color, flexShrink: 0 }} />
              {details.position && <span className={styles.position}>{details.position}</span>}
              {details.content && <span className={styles.content}>{details.content}</span>}
              {success && (
                <Icon
                  icon={Check}
                  size={14}
                  style={{ color: 'var(--ant-color-success)', flexShrink: 0 }}
                />
              )}
              {failed && (
                <>
                  <Icon icon={X} size={14} style={{ color: 'var(--ant-color-error)', flexShrink: 0 }} />
                  {result?.error && (
                    <Text as={'span'} fontSize={11} type={'danger'}>
                      {result.error}
                    </Text>
                  )}
                </>
              )}
            </div>
          );
        })}
      </Block>
    );
  },
);

ModifyNodesRender.displayName = 'ModifyNodesRender';

export default ModifyNodesRender;
