import { Alert, Flexbox, Icon, SliderWithInput } from '@lobehub/ui';
import { Sparkle, Sparkles } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

import styles from './Temperature.module.css';

const Warning = memo(() => {
  const { t } = useTranslation('setting');
  const [temperature] = useAgentStore((s) => {
    const config = agentSelectors.currentAgentConfig(s);
    return [config.params?.temperature];
  });

  return (
    typeof temperature === 'number' &&
    temperature >= 1.5 && (
      <Alert
        classNames={{ alert: styles.alert }}
        style={{ fontSize: 12 }}
        title={t('settingModel.temperature.warning')}
        type={'warning'}
        variant={'borderless'}
      />
    )
  );
});

interface TemperatureProps {
  disabled?: boolean;
  onChange?: (value: number) => void;
  value?: number;
}

const Temperature = memo<TemperatureProps>(({ value, onChange, disabled }) => {
  return (
    <Flexbox gap={4} style={{ width: '100%' }}>
      <SliderWithInput
        changeOnWheel
        controls={false}
        disabled={disabled}
        max={2}
        size={'small'}
        step={0.1}
        style={{ height: 42 }}
        value={value}
        marks={{
          0: <Icon icon={Sparkle} size={'small'} style={{ color: 'var(--ant-color-text-quaternary)' }} />,
          1: <div />,
          2: <Icon icon={Sparkles} size={'small'} style={{ color: 'var(--ant-color-text-quaternary)' }} />,
        }}
        styles={{
          input: {
            maxWidth: 43,
          },
        }}
        onChange={onChange}
      />
      {!disabled && <Warning />}
    </Flexbox>
  );
});

export default Temperature;
