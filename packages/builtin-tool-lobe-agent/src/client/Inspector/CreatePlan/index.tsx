'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { highlightTextStyles, inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { CreatePlanParams, CreatePlanState } from '../../../types';

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

export const CreatePlanInspector = memo<BuiltinInspectorProps<CreatePlanParams, CreatePlanState>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');

    const goal = args?.goal || partialArgs?.goal;

    if (isArgumentsStreaming && !goal) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-agent.apiName.createPlan')}</span>
        </div>
      );
    }

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        {goal ? (
          <Trans
            components={{ goal: <span className={highlightTextStyles.primary} /> }}
            i18nKey="builtins.lobe-agent.apiName.createPlan.result"
            ns="plugin"
            values={{ goal }}
          />
        ) : (
          <span>{t('builtins.lobe-agent.apiName.createPlan')}</span>
        )}
      </div>
    );
  },
);

CreatePlanInspector.displayName = 'CreatePlanInspector';

export default CreatePlanInspector;
