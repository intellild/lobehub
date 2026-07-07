'use client';

import { ActionIcon, Button, Flexbox, Input, Text } from '@lobehub/ui';
import { Switch } from 'antd';
import { snakeCase } from 'es-toolkit/compat';
import { ListRestartIcon, XIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

import { useServerConfigStore } from '@/store/serverConfig';
import { type FeatureFlagKey } from '@/store/serverConfig/slices/featureFlagOverride/action';

import FlagRow from './FlagRow';
import styles from './Panel.module.css';

interface PanelProps {
  onClose: () => void;
}

const Panel = memo<PanelProps>(({ onClose }) => {
  const originalFlags = useServerConfigStore((s) => s._originalFeatureFlags);
  const overrideCount = useServerConfigStore((s) => Object.keys(s._featureFlagOverrides).length);
  const overrides = useServerConfigStore((s) => s._featureFlagOverrides);
  const resetFlagOverrides = useServerConfigStore((s) => s.resetFlagOverrides);

  const [search, setSearch] = useState('');
  const [overriddenOnly, setOverriddenOnly] = useState(false);

  const flagKeys = useMemo<FeatureFlagKey[]>(() => {
    if (!originalFlags) return [];
    return (Object.keys(originalFlags) as FeatureFlagKey[]).sort();
  }, [originalFlags]);

  const visibleKeys = useMemo(() => {
    const term = search.trim().toLowerCase();
    return flagKeys.filter((key) => {
      if (overriddenOnly && overrides[key] === undefined) return false;
      if (!term) return true;
      return snakeCase(key as string).includes(term);
    });
  }, [flagKeys, overrides, overriddenOnly, search]);

  if (!originalFlags) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Flexbox gap={2}>
          <Text strong style={{ fontSize: 13 }}>
            Feature Flag Overrides
          </Text>
          <Text style={{ fontSize: 11 }} type={'secondary'}>
            dev only · client-side · localStorage persisted
          </Text>
        </Flexbox>
        <ActionIcon icon={XIcon} size={'small'} onClick={onClose} />
      </div>

      <div className={styles.toolbar}>
        <Input
          allowClear
          placeholder={'Search flag name…'}
          size={'small'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Flexbox horizontal align={'center'} gap={6}>
          <Switch checked={overriddenOnly} size={'small'} onChange={setOverriddenOnly} />
          <Text style={{ fontSize: 12 }} type={'secondary'}>
            overridden only
          </Text>
        </Flexbox>
      </div>

      <div className={styles.body}>
        {visibleKeys.length === 0 ? (
          <div className={styles.empty}>No flags match</div>
        ) : (
          visibleKeys.map((key) => <FlagRow flagKey={key} key={key} />)
        )}
      </div>

      <div className={styles.footer}>
        <Text style={{ fontSize: 11 }} type={'secondary'}>
          {overrideCount} active override{overrideCount === 1 ? '' : 's'}
        </Text>
        <Button
          disabled={overrideCount === 0}
          icon={ListRestartIcon}
          size={'small'}
          onClick={resetFlagOverrides}
        >
          Reset all
        </Button>
      </div>
    </div>
  );
});

Panel.displayName = 'DevFeatureFlagPanel/Panel';

export default Panel;
