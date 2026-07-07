'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon, Text } from '@lobehub/ui';
import { CheckCircle, DiffIcon, Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { oneLineEllipsis, shinyTextStyles } from '@/styles';

import type { UpdateTodosParams, UpdateTodosState } from '../../../types';
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

export const UpdateTodosInspector = memo<
  BuiltinInspectorProps<UpdateTodosParams, UpdateTodosState>
>(({ args, partialArgs, isArgumentsStreaming }) => {
  const { t } = useTranslation('plugin');

  const counts = useMemo(() => {
    const operations = args?.operations || partialArgs?.operations || [];
    return operations.reduce(
      (acc, op) => {
        switch (op.type) {
          case 'add': {
            acc.add++;
            break;
          }
          case 'update': {
            acc.update++;
            break;
          }
          case 'remove': {
            acc.remove++;
            break;
          }
          case 'complete': {
            acc.complete++;
            break;
          }
        }
        return acc;
      },
      { add: 0, complete: 0, remove: 0, update: 0 },
    );
  }, [args?.operations, partialArgs?.operations]);

  const hasOperations =
    counts.add > 0 || counts.update > 0 || counts.remove > 0 || counts.complete > 0;

  if (isArgumentsStreaming && !hasOperations) {
    return (
      <div className={cx(oneLineEllipsis, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-agent.apiName.updateTodos')}</span>
      </div>
    );
  }

  const statsParts: ReactNode[] = [];
  if (counts.add > 0) {
    statsParts.push(
      <Text code as={'span'} color={'var(--ant-color-success)'} fontSize={12} key="add">
        <Icon icon={Plus} size={12} />
        {counts.add}
      </Text>,
    );
  }
  if (counts.update > 0) {
    statsParts.push(
      <Text code as={'span'} color={'var(--ant-color-warning)'} fontSize={12} key="update">
        <Icon icon={DiffIcon} size={12} />
        {counts.update}
      </Text>,
    );
  }
  if (counts.complete > 0) {
    statsParts.push(
      <Text code as={'span'} color={'var(--ant-color-primary)'} fontSize={12} key="complete">
        <Icon icon={CheckCircle} size={12} />
        {counts.complete}
      </Text>,
    );
  }
  if (counts.remove > 0) {
    statsParts.push(
      <Text code as={'span'} color={'var(--ant-color-error)'} fontSize={12} key="remove">
        <Icon icon={Minus} size={12} />
        {counts.remove}
      </Text>,
    );
  }

  return (
    <div className={cx(oneLineEllipsis, isArgumentsStreaming && shinyTextStyles.shinyText)}>
      <span className={styles.title}>{t('builtins.lobe-agent.apiName.updateTodos')}</span>
      {statsParts.length > 0 && (
        <>
          {statsParts.map((part, index) => (
            <span key={index}>
              {index > 0 && <span className={styles.separator}> / </span>}
              {part}
            </span>
          ))}
        </>
      )}
    </div>
  );
});

UpdateTodosInspector.displayName = 'UpdateTodosInspector';

export default UpdateTodosInspector;
