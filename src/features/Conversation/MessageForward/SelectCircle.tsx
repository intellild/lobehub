'use client';

import { Center, Icon } from '@lobehub/ui';
import { Check } from 'lucide-react';
import { memo } from 'react';

import styles from './SelectCircle.module.css';

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

interface SelectCircleProps {
  checked?: boolean;
  className?: string;
}

/**
 * WeChat-style round selection indicator: a hollow circle that fills with the
 * primary color and a check when selected. Replaces the square antd Checkbox in
 * multi-select rows.
 */
const SelectCircle = memo<SelectCircleProps>(({ checked, className }) => (
  <Center className={cx(styles.circle, checked && styles.checked, className)}>
    {checked && <Icon icon={Check} size={14} />}
  </Center>
));

SelectCircle.displayName = 'SelectCircle';

export default SelectCircle;
