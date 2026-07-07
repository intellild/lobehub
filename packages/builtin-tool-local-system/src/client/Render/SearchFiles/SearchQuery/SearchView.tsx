import { Flexbox, Icon } from '@lobehub/ui';
import { SearchIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { shinyTextStyles } from '@/styles';

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
  defaultQuery: string;
  resultsNumber: number;
  searching?: boolean;
}

const SearchBar = memo<SearchBarProps>(({ defaultQuery, resultsNumber, searching }) => {
  const { t } = useTranslation('tool');
  return (
    <Flexbox horizontal align={'center'} distribution={'space-between'} gap={40} height={26}>
      <Flexbox
        horizontal
        align={'center'}
        className={cx(styles.query, searching && shinyTextStyles.shinyText)}
        gap={8}
      >
        <Icon icon={SearchIcon} />
        {defaultQuery}
      </Flexbox>

      <Flexbox horizontal align={'center'} className={styles.font}>
        <div>{t('search.searchResult')}</div>
        {resultsNumber}
      </Flexbox>
    </Flexbox>
  );
});
export default SearchBar;
