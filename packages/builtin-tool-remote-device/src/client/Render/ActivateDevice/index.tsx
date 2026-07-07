'use client';

import { type BuiltinRenderProps } from '@lobechat/types';
import { Icon } from '@lobehub/ui';
import { AlertTriangleIcon } from 'lucide-react';
import { memo } from 'react';

import type { ActivateDeviceParams, ActivateDeviceState } from '../../../types';
import DeviceCard from '../DeviceCard';
import styles from './index.module.css';

const ActivateDevice = memo<BuiltinRenderProps<ActivateDeviceParams, ActivateDeviceState, string>>(
  ({ pluginState, content }) => {
    const device = pluginState?.activatedDevice;

    if (device) return <DeviceCard activated device={device} />;

    // Activation failed without a thrown error (e.g. device offline / unknown), so no state is
    // produced. Fall back to the explanatory content the runtime returned instead of rendering
    // blank — the tool detail view only skips custom renders when `result.error` is set.
    if (typeof content === 'string' && content.length > 0) {
      return (
        <div className={styles.failure}>
          <Icon icon={AlertTriangleIcon} size={14} />
          {content}
        </div>
      );
    }

    return null;
  },
);

ActivateDevice.displayName = 'ActivateDevice';

export default ActivateDevice;
