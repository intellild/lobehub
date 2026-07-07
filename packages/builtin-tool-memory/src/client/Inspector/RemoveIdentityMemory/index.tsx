'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { RemoveIdentityMemoryParams, RemoveIdentityMemoryState } from '../../../types';
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

export const RemoveIdentityMemoryInspector = memo<
  BuiltinInspectorProps<RemoveIdentityMemoryParams, RemoveIdentityMemoryState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const id = args?.id || partialArgs?.id;

  // Initial streaming state
  if (isArgumentsStreaming && !id) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-user-memory.apiName.removeIdentityMemory')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.identityId;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-user-memory.apiName.removeIdentityMemory')}</span>
      {id && (
        <>
          :<span className={highlightTextStyles.warning}>{id}</span>
        </>
      )}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </div>
  );
});

RemoveIdentityMemoryInspector.displayName = 'RemoveIdentityMemoryInspector';

export default RemoveIdentityMemoryInspector;
