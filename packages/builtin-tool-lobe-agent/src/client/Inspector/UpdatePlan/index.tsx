'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon, Text } from '@lobehub/ui';
import { CheckCircle, DiffIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { oneLineEllipsis, shinyTextStyles } from '@/styles';

import type { UpdatePlanParams, UpdatePlanState } from '../../../types';
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

export const UpdatePlanInspector = memo<BuiltinInspectorProps<UpdatePlanParams, UpdatePlanState>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const planId = args?.planId || partialArgs?.planId;
    const completed = args?.completed;
    const hasUpdates = args?.goal || args?.description || args?.context;

    if (isArgumentsStreaming && !planId) {
      return (
        <div className={cx(oneLineEllipsis, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-agent.apiName.updatePlan')}</span>
        </div>
      );
    }

    return (
      <div className={cx(oneLineEllipsis, isArgumentsStreaming && shinyTextStyles.shinyText)}>
        <span className={styles.title}>{t('builtins.lobe-agent.apiName.updatePlan')}</span>
        {completed && (
          <Text code as={'span'} color={'var(--ant-color-success)'} fontSize={12}>
            <Icon icon={CheckCircle} size={12} />
            {t('builtins.lobe-agent.apiName.updatePlan.completed')}
          </Text>
        )}
        {hasUpdates && !completed && (
          <Text code as={'span'} color={'var(--ant-color-warning)'} fontSize={12}>
            <Icon icon={DiffIcon} size={12} />
            {t('builtins.lobe-agent.apiName.updatePlan.modified')}
          </Text>
        )}
      </div>
    );
  },
);

UpdatePlanInspector.displayName = 'UpdatePlanInspector';

export default UpdatePlanInspector;
