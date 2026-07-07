import { CheckCircleFilled } from '@ant-design/icons';
import { type StorageModeEnum } from '@lobechat/electron-client-ipc';
import { Center, Flexbox } from '@lobehub/ui';
import { type ComponentType, type ReactNode } from 'react';

import styles from './Option.module.css';

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

export interface OptionProps {
  children?: ReactNode;
  description: string;
  icon: ComponentType<any>;
  isSelected: boolean;
  label: string;
  onClick: (value: StorageModeEnum) => void;
  value: StorageModeEnum; // For self-hosted input
}

export const Option = ({
  description,
  icon: PrefixIcon,
  label,
  value,
  isSelected,
  onClick,
  children,
}: OptionProps) => {
  return (
    <Flexbox
      className={cx(styles.optionCard, isSelected && styles.checked)}
      direction="vertical"
      key={value}
      onClick={() => onClick(value)}
    >
      <div className={styles.optionInner}>
        <Flexbox horizontal gap={16}>
          <Center className={styles.iconWrapper}>
            <PrefixIcon />
          </Center>
          <Flexbox gap={8}>
            <div className={styles.label}>{label}</div>
            <div className={styles.description}>{description}</div>
          </Flexbox>
        </Flexbox>
        {isSelected && <CheckCircleFilled style={{ fontSize: 16 }} />}
      </div>
      {children}
    </Flexbox>
  );
};
