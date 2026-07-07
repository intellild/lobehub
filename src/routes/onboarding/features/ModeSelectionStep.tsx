'use client';

import { Block, Button, Flexbox, Text } from '@lobehub/ui';
import { Undo2Icon } from 'lucide-react';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useIsDark } from '@/hooks/useIsDark';
import LobeMessage from '@/routes/onboarding/components/LobeMessage';
import { useUserStore } from '@/store/user';
import { isDev } from '@/utils/env';
import { consumeOnboardingCallbackUrl } from '@/utils/onboardingRedirect';

import styles from './ModeSelectionStep.module.css';

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

interface ModeSelectionStepProps {
  onBack: () => void;
  onNext: () => void;
}

const ModeSelectionStep = memo<ModeSelectionStepProps>(({ onBack, onNext }) => {
  const { t } = useTranslation('onboarding');
  const navigate = useWorkspaceAwareNavigate();
  const isDarkMode = useIsDark();

  const imageStyles = useMemo<React.CSSProperties>(
    () =>
      ({
        '--lite-img': `url('${isDarkMode ? '/images/mode_lite_dark.webp' : '/images/mode_lite_light.webp'}')`,
        '--pro-img': `url('${isDarkMode ? '/images/mode_pro_dark.webp' : '/images/mode_pro_light.webp'}')`,
      }) as React.CSSProperties,
    [isDarkMode],
  );

  const [updateGeneralConfig, finishOnboarding] = useUserStore((s) => [
    s.updateGeneralConfig,
    s.finishOnboarding,
  ]);

  const handleSelectLite = () => {
    updateGeneralConfig({ isLiteMode: true });
    finishOnboarding();

    if (!isDev) {
      navigate(consumeOnboardingCallbackUrl() || '/');
    }
  };

  const handleSelectPro = () => {
    updateGeneralConfig({ isLiteMode: false });
    onNext();
  };

  return (
    <Flexbox>
      <LobeMessage
        sentences={[t('modeSelection.title'), t('modeSelection.title2'), t('modeSelection.title3')]}
      />
      <Text type={'secondary'}>{t('modeSelection.hint')}</Text>
      <Flexbox gap={16} paddingBlock={24}>
        {/* Lite Mode Option */}
        <Block
          clickable
          className={cx(styles.base, styles.lite)}
          padding={16}
          style={imageStyles}
          variant={'outlined'}
          onClick={handleSelectLite}
        >
          <Flexbox
            gap={8}
            style={{
              zIndex: 10,
            }}
          >
            <Text strong as={'h2'} fontSize={18}>
              {t('modeSelection.lite.title')}
            </Text>
            <Text as={'p'}>{t('modeSelection.lite.subtitle')}</Text>
            <Text as={'p'} type={'secondary'}>
              {t('modeSelection.lite.desc')}
            </Text>
          </Flexbox>
        </Block>

        {/* Pro Mode Option */}
        <Block
          clickable
          className={cx(styles.base, styles.pro)}
          padding={16}
          style={imageStyles}
          variant={'outlined'}
          onClick={handleSelectPro}
        >
          <Flexbox
            gap={8}
            style={{
              zIndex: 10,
            }}
          >
            <Text strong as={'h2'} fontSize={18}>
              {t('modeSelection.pro.title')}
            </Text>
            <Text as={'p'}>{t('modeSelection.pro.subtitle')}</Text>
            <Text as={'p'} type={'secondary'}>
              {t('modeSelection.pro.desc')}
            </Text>
          </Flexbox>
        </Block>
      </Flexbox>
      <Flexbox horizontal align={'center'} justify={'space-between'}>
        <Button
          icon={Undo2Icon}
          type={'text'}
          style={{
            color: 'var(--ant-color-text-description)',
          }}
          onClick={onBack}
        >
          {t('back')}
        </Button>
      </Flexbox>
    </Flexbox>
  );
});

ModeSelectionStep.displayName = 'ModeSelectionStep';

export default ModeSelectionStep;
