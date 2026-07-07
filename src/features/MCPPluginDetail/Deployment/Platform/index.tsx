import { type ConnectionConfig } from '@lobehub/market-types';
import { Block, Highlighter } from '@lobehub/ui';
import { memo } from 'react';

import { genServerConfig } from '@/features/MCP/utils';

import styles from './index.module.css';

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

interface PlatformProps {
  connection?: ConnectionConfig;
  identifier?: string;
  lite?: boolean;
  mobile?: boolean;
}

const Platform = memo<PlatformProps>(({ lite, identifier, connection }) => {
  const serverConfig = genServerConfig(identifier, connection);

  return (
    <Block gap={lite ? 0 : 16} padding={4} variant={lite ? 'outlined' : 'borderless'}>
      <Highlighter
        fullFeatured
        className={cx(lite && styles.lite)}
        fileName={'MCP server config'}
        language={'json'}
        variant={'filled'}
        style={{
          fontSize: 12,
        }}
      >
        {serverConfig}
      </Highlighter>
    </Block>
  );
});

export default Platform;
