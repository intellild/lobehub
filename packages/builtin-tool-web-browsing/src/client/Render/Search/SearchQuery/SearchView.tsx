import { Block, Flexbox, Icon, Skeleton, Text } from '@lobehub/ui';
import { SearchIcon } from 'lucide-react';
import { memo } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { shinyTextStyles } from '@/styles';

import { EngineAvatarGroup } from '../../../components/EngineAvatar';
import styles from './SearchView.module.css';

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

interface SearchBarProps {
  defaultEngines: string[];
  defaultQuery: string;
  onEditingChange: (editing: boolean) => void;
  resultsNumber: number;
  searching?: boolean;
}

const SearchBar = memo<SearchBarProps>(
  ({ defaultEngines, defaultQuery, resultsNumber, onEditingChange, searching }) => {
    const isMobile = useIsMobile();
    return (
      <Flexbox
        align={isMobile ? 'flex-start' : 'center'}
        distribution={'space-between'}
        gap={isMobile ? 8 : 40}
        height={isMobile ? undefined : 32}
        horizontal={!isMobile}
      >
        <Block
          clickable
          horizontal
          align={'center'}
          className={cx(styles.query, searching && shinyTextStyles.shinyText)}
          gap={8}
          variant={'borderless'}
          onClick={() => {
            onEditingChange(true);
          }}
        >
          <Icon icon={SearchIcon} />
          {defaultQuery}
        </Block>

        {searching ? (
          <Skeleton.Block active style={{ height: 20, width: 40 }} />
        ) : (
          <Flexbox horizontal align={'center'} gap={4}>
            <EngineAvatarGroup engines={defaultEngines} />
            {!isMobile && (
              <Text style={{ fontSize: 12 }} type={'secondary'}>
                {resultsNumber}
              </Text>
            )}
          </Flexbox>
        )}
      </Flexbox>
    );
  },
);
export default SearchBar;
