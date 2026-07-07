'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { Icon } from '@lobehub/ui';
import { ListChecks } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { GenerateVerifyPlanParams, GenerateVerifyPlanState } from '../../../types';
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

export const GenerateVerifyPlanInspector = memo<
  BuiltinInspectorProps<GenerateVerifyPlanParams, GenerateVerifyPlanState>
>(({ args, partialArgs, pluginState, isArgumentsStreaming }) => {
  const { t } = useTranslation('plugin');

  const title = pluginState?.title || args?.title || partialArgs?.title;

  return (
    <div
      className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
    >
      <span>{t('builtins.lobe-delivery-checker.apiName.generateVerifyPlan')}</span>
      {title && (
        <span className={styles.chip}>
          <Icon className={styles.chipIcon} icon={ListChecks} size={13} />
          <span className={styles.chipLabel}>{title}</span>
        </span>
      )}
    </div>
  );
});

GenerateVerifyPlanInspector.displayName = 'GenerateVerifyPlanInspector';

export default GenerateVerifyPlanInspector;
