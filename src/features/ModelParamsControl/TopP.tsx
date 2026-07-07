import { Flexbox, Icon, SliderWithInput } from '@lobehub/ui';
import { FlowerIcon, TrainFrontTunnel } from 'lucide-react';
import { memo } from 'react';

interface TopPProps {
  disabled?: boolean;
  onChange?: (value: number) => void;
  value?: number;
}

const TopP = memo<TopPProps>(({ value, onChange, disabled }) => {
  return (
    <Flexbox style={{ width: '100%' }}>
      <SliderWithInput
        changeOnWheel
        controls={false}
        disabled={disabled}
        max={1}
        min={0}
        size={'small'}
        step={0.1}
        style={{ height: 42 }}
        value={value}
        marks={{
          0: (
            <Icon
              icon={TrainFrontTunnel}
              size={'small'}
              style={{ color: 'var(--ant-color-text-quaternary)' }}
            />
          ),
          0.9: <div />,
          1: (
            <Icon icon={FlowerIcon} size={'small'} style={{ color: 'var(--ant-color-text-quaternary)' }} />
          ),
        }}
        styles={{
          input: {
            maxWidth: 43,
          },
        }}
        onChange={onChange}
      />
    </Flexbox>
  );
});
export default TopP;
