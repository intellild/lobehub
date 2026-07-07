import type { BuiltinPlaceholderProps, SearchQuery } from '@lobechat/types';
import { Flexbox, Icon, Skeleton } from '@lobehub/ui';
import { SearchIcon } from 'lucide-react';
import { memo } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { shinyTextStyles } from '@/styles';

import stylesModule from './Search.module.css';

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

const ITEM_HEIGHT = 80;
const ITEM_WIDTH = 160;
const styles: typeof stylesModule & { query: string } = {
  ...stylesModule,
  query: [stylesModule.query, shinyTextStyles.shinyText].join(' '),
};

export const Search = memo<BuiltinPlaceholderProps<SearchQuery>>(({ args }) => {
  const { query } = args || {};

  const isMobile = useIsMobile();
  return (
    <Flexbox gap={8}>
      <Flexbox
        align={isMobile ? 'flex-start' : 'center'}
        distribution={'space-between'}
        gap={isMobile ? 8 : 40}
        height={isMobile ? undefined : 32}
        horizontal={!isMobile}
      >
        <Flexbox horizontal align={'center'} className={styles.query} gap={8}>
          <Icon icon={SearchIcon} />
          {query ? query : <Skeleton.Block active style={{ height: 20, width: 40 }} />}
        </Flexbox>

        <Skeleton.Block active style={{ height: 20, width: 40 }} />
      </Flexbox>
      <Flexbox horizontal gap={12}>
        {['1', '2', '3', '4', '5'].map((id) => (
          <Skeleton.Button
            active
            key={id}
            style={{ borderRadius: 8, height: ITEM_HEIGHT, width: ITEM_WIDTH }}
          />
        ))}
      </Flexbox>
    </Flexbox>
  );
});
