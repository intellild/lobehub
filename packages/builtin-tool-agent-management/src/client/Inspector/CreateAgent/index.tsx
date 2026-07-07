'use client';

import { DEFAULT_AVATAR } from '@lobechat/const';
import type { BuiltinInspectorProps } from '@lobechat/types';
import { Avatar, Flexbox } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/useTheme';
import { highlightTextStyles, shinyTextStyles } from '@/styles';

import type { CreateAgentParams } from '../../../types';
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

export const CreateAgentInspector = memo<BuiltinInspectorProps<CreateAgentParams>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');
    const theme = useTheme();

    const title = args?.title || partialArgs?.title;
    const avatar = args?.avatar || partialArgs?.avatar;
    const backgroundColor = args?.backgroundColor || partialArgs?.backgroundColor;

    if (isArgumentsStreaming && !title) {
      return (
        <div className={cx(styles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-agent-management.apiName.createAgent')}</span>
        </div>
      );
    }

    return (
      <Flexbox
        horizontal
        align={'center'}
        className={cx(styles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
        gap={8}
      >
        <span className={styles.title}>
          {t('builtins.lobe-agent-management.inspector.createAgent.title')}
        </span>
        <Avatar
          avatar={avatar || DEFAULT_AVATAR}
          background={backgroundColor || theme.colorBgContainer}
          shape={'square'}
          size={24}
          title={title || undefined}
        />
        {title && <span className={highlightTextStyles.primary}>{title}</span>}
      </Flexbox>
    );
  },
);

CreateAgentInspector.displayName = 'CreateAgentInspector';

export default CreateAgentInspector;
