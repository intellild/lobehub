'use client';

import { AGENT_SKILLS_IDENTIFIER_PREFIX } from '@lobechat/const';
import { type BuiltinInspectorProps } from '@lobechat/types';
import { SkillsIcon } from '@lobehub/ui/icons';
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

type SkillLabelKey =
  | 'builtins.lobe-skills.apiName.activateAgentSkill'
  | 'builtins.lobe-skills.apiName.activateDeviceSkill'
  | 'builtins.lobe-skills.apiName.activateProjectSkill'
  | 'builtins.lobe-skills.apiName.activateSkill';

/**
 * Resolve the inspector label key. State-side `source` is the authority once the
 * tool result has streamed in; while args are still streaming we only have the
 * raw `name` to go on, so detect agent skills via the identifier prefix as a
 * best-effort fallback. Filesystem skills can't be inferred from the bare name
 * (no prefix), so they show "Activate Skill" until the result lands.
 */
const resolveLabelKey = (
  source: ActivateSkillSource | undefined,
  rawName: string | undefined,
): SkillLabelKey => {
  const effective: ActivateSkillSource =
    source ?? (rawName?.startsWith(AGENT_SKILLS_IDENTIFIER_PREFIX) ? 'agent' : 'builtin');

  switch (effective) {
    case 'agent': {
      return 'builtins.lobe-skills.apiName.activateAgentSkill';
    }
    case 'device': {
      return 'builtins.lobe-skills.apiName.activateDeviceSkill';
    }
    case 'project': {
      return 'builtins.lobe-skills.apiName.activateProjectSkill';
    }
    default: {
      return 'builtins.lobe-skills.apiName.activateSkill';
    }
  }
};

export const RunSkillInspector = memo<
  BuiltinInspectorProps<ActivateSkillParams, ActivateSkillState>
>(({ args, partialArgs, isArgumentsStreaming, isLoading, pluginState }) => {
  const { t } = useTranslation('plugin');

  const name = args?.name || partialArgs?.name;
  const displayName = pluginState?.title || pluginState?.name || name;
  const label = t(resolveLabelKey(pluginState?.source, name));

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

RunSkillInspector.displayName = 'RunSkillInspector';
