'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon, Text } from '@lobehub/ui';
import { Plus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { oneLineEllipsis, shinyTextStyles } from '@/styles';

import type { CreateTodosParams, CreateTodosState } from '../../../types';
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

export const CreateTodosInspector = memo<
  BuiltinInspectorProps<CreateTodosParams, CreateTodosState>
>(({ args, partialArgs, isArgumentsStreaming }) => {
  const { t } = useTranslation('plugin');

  const adds = args?.adds || partialArgs?.adds || [];
  const items = args?.items || [];
  const count = adds.length || items.length;

  if (isArgumentsStreaming && count === 0) {
    return (
      <div className={cx(oneLineEllipsis, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-agent.apiName.createTodos')}</span>
      </div>
    );
  }

  return (
    <div className={cx(oneLineEllipsis, isArgumentsStreaming && shinyTextStyles.shinyText)}>
      <span className={styles.title}>{t('builtins.lobe-agent.apiName.createTodos')}</span>
      {count > 0 && (
        <Text code as={'span'} color={'var(--ant-color-success)'} fontSize={12}>
          <Icon icon={Plus} size={12} />
          {count}
        </Text>
      )}
    </div>
  );
});

CreateTodosInspector.displayName = 'CreateTodosInspector';

export default CreateTodosInspector;
