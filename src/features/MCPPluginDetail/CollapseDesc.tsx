import { Text } from '@lobehub/ui';
import { type PropsWithChildren } from 'react';
import { memo } from 'react';

import styles from './CollapseDesc.module.css';

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

const CollapseDesc = memo<PropsWithChildren<{ hide?: boolean }>>(({ children, hide }) => {
  return (
    <Text as={'p'} className={cx(styles.desc, hide && styles.hideDesc)}>
      {children}
    </Text>
  );
});

export default CollapseDesc;
