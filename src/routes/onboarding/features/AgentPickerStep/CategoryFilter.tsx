import type { MarketplaceCategory } from '@lobechat/builtin-tool-web-onboarding/agentMarketplace';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { CATEGORY_LABEL_KEYS } from './categoryLabels';
import { styles } from './style';

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

export type ActiveCategory = MarketplaceCategory | 'all';

interface CategoryFilterProps {
  active: ActiveCategory;
  allLabel: string;
  categories: MarketplaceCategory[];
  onChange: (next: ActiveCategory) => void;
}

const CategoryFilter = memo<CategoryFilterProps>(({ active, allLabel, categories, onChange }) => {
  const { t: tTool } = useTranslation('tool');

  const renderPill = (value: ActiveCategory, label: string) => (
    <button
      aria-pressed={active === value}
      className={cx(styles.pill, active === value && styles.pillActive)}
      key={value}
      type="button"
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  );

  return (
    <div className={styles.filterBar}>
      {renderPill('all', allLabel)}
      {categories.map((category) => renderPill(category, tTool(CATEGORY_LABEL_KEYS[category])))}
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
