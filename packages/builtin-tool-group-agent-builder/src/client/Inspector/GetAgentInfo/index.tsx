'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { shinyTextStyles } from '@/styles';

import type { GetAgentInfoParams } from '../../../types';
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

interface GetAgentInfoState {
  avatar?: string;
  title?: string;
}
const styles = stylesModule;

export const GetAgentInfoInspector = memo<
  BuiltinInspectorProps<GetAgentInfoParams, GetAgentInfoState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const agentId = args?.agentId || partialArgs?.agentId;
  const title = pluginState?.title;
  const avatar = pluginState?.avatar;

  // Initial streaming state
  if (isArgumentsStreaming && !agentId) {
    return (
      <div className={cx(styles.root, shinyTextStyles.shinyText)}>
        <span>{t('builtins.lobe-group-agent-builder.apiName.getAgentInfo')}</span>
      </div>
    );
  }

  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, (isArgumentsStreaming || isLoading) && shinyTextStyles.shinyText)}
      gap={8}
    >
      <span className={styles.title}>
        {t('builtins.lobe-group-agent-builder.apiName.getAgentInfo')}:
      </span>
      {avatar && <Avatar avatar={avatar} shape={'square'} size={20} title={title || undefined} />}
      <span>{title || agentId}</span>
    </Flexbox>
  );
});

GetAgentInfoInspector.displayName = 'GetAgentInfoInspector';

export default GetAgentInfoInspector;
