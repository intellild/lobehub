'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { shinyTextStyles } from '@/styles';

import type { CreateGroupParams, CreateGroupState } from '../../../types';
import stylesModule from './index.module.css';

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

const styles = stylesModule;

export const CreateGroupInspector = memo<
  BuiltinInspectorProps<CreateGroupParams, CreateGroupState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const title = args?.title || partialArgs?.title;
  const avatar = args?.avatar || partialArgs?.avatar;

  if (isArgumentsStreaming && !title) {
    return (
      <div className={cx(styles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.createGroup')}</span>
      </div>
    );
  }

  const isSuccess = pluginState?.success;

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText)}
      gap={8}
    >
      <span className={styles.title}>
        {t('builtins.lobe-group-agent-builder.apiName.createGroup')}:
      </span>
      {avatar && <Avatar avatar={avatar} shape={'square'} size={20} title={title || undefined} />}
      {title && <span>{title}</span>}
      {!isLoading && isSuccess && (
        <Check className={styles.statusIcon} color={'var(--ant-color-success)'} size={14} />
      )}
    </Flexbox>
  );
});

CreateGroupInspector.displayName = 'CreateGroupInspector';

export default CreateGroupInspector;
