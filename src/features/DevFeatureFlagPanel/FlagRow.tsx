'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { Segmented } from '@lobehub/ui/base-ui';
import { snakeCase } from 'es-toolkit/compat';
import { memo, useMemo } from 'react';

import { useServerConfigStore } from '@/store/serverConfig';
import { type FeatureFlagKey } from '@/store/serverConfig/slices/featureFlagOverride/action';

import styles from './FlagRow.module.css';

type SegmentedValue = 'true' | 'false' | 'inherit';

const segmentOptions = [
  { label: 'true', value: 'true' as const },
  { label: 'false', value: 'false' as const },
  { label: 'inherit', value: 'inherit' as const },
];

interface FlagRowProps {
  flagKey: FeatureFlagKey;
}

const FlagRow = memo<FlagRowProps>(({ flagKey }) => {
  const original = useServerConfigStore((s) => s._originalFeatureFlags?.[flagKey]);
  const overrideValue = useServerConfigStore(
    (s) => s._featureFlagOverrides[flagKey] as boolean | undefined,
  );
  const setFlagOverride = useServerConfigStore((s) => s.setFlagOverride);

  const isOverridden = overrideValue !== undefined;

  const value: SegmentedValue = useMemo(() => {
    if (overrideValue === true) return 'true';
    if (overrideValue === false) return 'false';
    return 'inherit';
  }, [overrideValue]);

  const handleChange = (next: SegmentedValue) => {
    if (next === 'inherit') {
      setFlagOverride(flagKey, undefined);
      return;
    }
    setFlagOverride(flagKey, next === 'true');
  };

  return (
    <div className={`${styles.row} ${isOverridden ? styles.rowOverridden : ''}`}>
      <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
        <Text ellipsis className={styles.name}>
          {snakeCase(flagKey as string)}
        </Text>
        <span className={styles.meta}>server: {String(original)}</span>
      </Flexbox>
      <Segmented
        className={styles.control}
        options={segmentOptions}
        size={'small'}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
});

FlagRow.displayName = 'DevFeatureFlagPanel/FlagRow';

export default FlagRow;
