'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Check } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { UpdateGroupParams, UpdateGroupState } from '../../../types';
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

export const UpdateGroupInspector = memo<
  BuiltinInspectorProps<UpdateGroupParams, UpdateGroupState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const config = args?.config || partialArgs?.config;
  const meta = args?.meta || partialArgs?.meta;

  // Build display text from updated fields
  const displayText = useMemo(() => {
    const fields: string[] = [];
    // Config fields
    if (config?.openingMessage !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.openingMessage'));
    }
    if (config?.openingQuestions !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.openingQuestions'));
    }
    // Meta fields
    if (meta?.title !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.title'));
    }
    if (meta?.description !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.description'));
    }
    if (meta?.avatar !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.avatar'));
    }
    if (meta?.backgroundColor !== undefined) {
      fields.push(t('builtins.lobe-group-agent-builder.inspector.backgroundColor'));
    }
    return fields.length > 0 ? fields.join(', ') : '';
  }, [config, meta, t]);

  // Initial streaming state
  if (isArgumentsStreaming && !displayText) {
    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.updateGroup')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.success;

  return (
    <div
      className={cx(
        inspectorTextStyles.root,
        (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText,
      )}
    >
      <span>{t('builtins.lobe-group-agent-builder.apiName.updateGroup')}</span>
      {displayText && (
        <>
          :<span className={highlightTextStyles.primary}>{displayText}</span>
        </>
      )}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </div>
  );
});

UpdateGroupInspector.displayName = 'UpdateGroupInspector';

export default UpdateGroupInspector;
