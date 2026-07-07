'use client';

import type { InterestAreaKey } from '@lobechat/const';
import type { BuiltinRenderProps, SaveUserQuestionInput } from '@lobechat/types';
import { Flexbox, Text } from '@lobehub/ui';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './index.module.css';

const SaveUserQuestion = memo<BuiltinRenderProps<SaveUserQuestionInput, unknown, unknown>>(
  ({ args }) => {
    const { t } = useTranslation('plugin');
    const { t: tOnboarding } = useTranslation('onboarding');

    const agentName = args?.agentName?.trim();
    const agentEmoji = args?.agentEmoji?.trim();
    const fullName = args?.fullName?.trim();
    const interestLabels = useMemo(() => {
      const predefined = (args?.interests ?? []).map((key) =>
        tOnboarding(`interests.area.${key as InterestAreaKey}`),
      );
      const custom = (args?.customInterests ?? [])
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      return [...predefined, ...custom];
    }, [args?.interests, args?.customInterests, tOnboarding]);

    const hasAgentIdentity = Boolean(agentName || agentEmoji);
    const hasUserProfile = Boolean(fullName);
    const hasInterests = interestLabels.length > 0;

    if (!hasAgentIdentity && !hasUserProfile && !hasInterests) return null;

    return (
      <Flexbox gap={16}>
        {hasAgentIdentity && (
          <Flexbox gap={8}>
            <Text className={styles.sectionLabel}>
              {t('builtins.lobe-web-onboarding.render.agent')}
            </Text>
            <div className={styles.detailCard}>
              <Flexbox horizontal align="center" gap={12}>
                <div className={styles.avatar}>{agentEmoji || '🤖'}</div>
                {agentName && <div className={styles.name}>{agentName}</div>}
              </Flexbox>
            </div>
          </Flexbox>
        )}

        {hasUserProfile && (
          <Flexbox gap={8}>
            <Text className={styles.sectionLabel}>
              {t('builtins.lobe-web-onboarding.render.fullName')}
            </Text>
            <div className={styles.detailCard}>
              <div className={styles.value}>{fullName}</div>
            </div>
          </Flexbox>
        )}

        {hasInterests && (
          <Flexbox gap={8}>
            <Text className={styles.sectionLabel}>
              {t('builtins.lobe-web-onboarding.render.interests')}
            </Text>
            <Flexbox horizontal style={{ flexWrap: 'wrap', gap: 8 }}>
              {interestLabels.map((label) => (
                <span className={styles.chip} key={label}>
                  {label}
                </span>
              ))}
            </Flexbox>
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);

SaveUserQuestion.displayName = 'WebOnboardingSaveUserQuestion';

export default SaveUserQuestion;
