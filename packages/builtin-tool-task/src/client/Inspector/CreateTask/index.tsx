'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon, Tooltip } from '@lobehub/ui';
import { CornerDownRight } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { CreateTaskParams, CreateTaskState } from '../../../types';
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

export const CreateTaskInspector = memo<BuiltinInspectorProps<CreateTaskParams, CreateTaskState>>(
  ({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
    const { t } = useTranslation('plugin');

    const name = args?.name || partialArgs?.name;
    const identifier = pluginState?.identifier;
    const parentIdentifier = args?.parentIdentifier || partialArgs?.parentIdentifier;

    if (isArgumentsStreaming && !name) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-task.apiName.createTask')}</span>
        </div>
      );
    }

    return (
      <div
        style={{ flexWrap: 'wrap', gap: 4 }}
        className={cx(
          inspectorTextStyles.root,
          (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
        )}
      >
        <span>{t('builtins.lobe-task.apiName.createTask')}</span>
        {identifier && (
          <span className={styles.identifierChip} style={{ marginInlineStart: 6 }}>
            {identifier}
          </span>
        )}
        {name && (
          <span className={styles.chip} style={{ color: 'var(--ant-color-text)' }}>
            {name}
          </span>
        )}
        {parentIdentifier && (
          <Tooltip title={t('builtins.lobe-task.create.subtaskOf', { parent: parentIdentifier })}>
            <span className={styles.subtaskTag}>
              <Icon icon={CornerDownRight} size={11} />
              {parentIdentifier}
            </span>
          </Tooltip>
        )}
      </div>
    );
  },
);

CreateTaskInspector.displayName = 'CreateTaskInspector';

export default CreateTaskInspector;
