'use client';

import { type BuiltinInspectorProps } from '@lobechat/types';
import { SkillsIcon } from '@lobehub/ui/icons';
import { type TFunction } from 'i18next';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

import type { ActivateSkillParams, ActivateSkillSource, ActivateSkillState } from '../../../types';
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

/**
 * `t` is invoked with literal keys per branch so i18next's typed-key map can
 * still validate the call site.
 */
const resolveLabel = (t: TFunction<'plugin'>, source: ActivateSkillSource | undefined): string => {
  switch (source) {
    case 'agent': {
      return t('builtins.lobe-skills.apiName.activateAgentSkill');
    }
    case 'device': {
      return t('builtins.lobe-skills.apiName.activateDeviceSkill');
    }
    case 'project': {
      return t('builtins.lobe-skills.apiName.activateProjectSkill');
    }
    default: {
      return t('builtins.lobe-skills.apiName.activateSkill');
    }
  }
};

export const ActivateSkillInspector = memo<
  BuiltinInspectorProps<ActivateSkillParams, ActivateSkillState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const name = args?.name || partialArgs?.name;
  const displayName = pluginState?.title || pluginState?.name || name;
  const label = resolveLabel(t, pluginState?.source);

  if (isArgumentsStreaming) {
    if (!displayName)
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{label}</span>
        </div>
      );

    return (
      <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
        <span>{label}:</span>
        <span className={styles.chip}>
          <SkillsIcon className={styles.skillIcon} size={12} />
          <span className={styles.skillName}>{displayName}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cx(inspectorTextStyles.root, isLoading && shinyTextStyles.shinyText)}>
      <span>{label}:</span>
      {displayName && (
        <span className={styles.chip}>
          <SkillsIcon className={styles.skillIcon} size={12} />
          <span className={styles.skillName}>{displayName}</span>
        </span>
      )}
    </div>
  );
});

ActivateSkillInspector.displayName = 'ActivateSkillInspector';
